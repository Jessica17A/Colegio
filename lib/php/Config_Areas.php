<?php
require_once '../db/conexion.php';
header('Content-Type: application/json; charset=utf-8');
ob_clean();

function generarCodigoAleatorio($longitud = 10) {
  return substr(str_shuffle('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'), 0, $longitud);
}

function normalizarVista($texto) {
  $t = strtoupper(trim($texto));
  $t = preg_replace('/\s+/', '_', $t);
  $t = preg_replace('/[^A-Z0-9_]/', '', $t);
  return $t ?: 'VISTA';
}

function crearArchivosVista($vistaNombre) {
  $map = [
    'php'  => "../php/{$vistaNombre}.php",
    'js'   => "../js/{$vistaNombre}.js",
    'css'  => "../css/{$vistaNombre}.css",
    'view' => "../view/{$vistaNombre}.html"
  ];
  foreach ($map as $tipo => $ruta) {
    if (!file_exists($ruta)) {
      @file_put_contents($ruta, "<!-- Archivo {$tipo} generado para {$vistaNombre} -->");
    }
  }
}

function jerr($msg){ echo json_encode(['success'=>false,'message'=>$msg]); exit; }

$a0 = isset($_POST['a0']) ? intval($_POST['a0']) : null;
if ($a0 === null) jerr('Parámetro a0 requerido.');

switch ($a0) {

  /* 1) Árbol: ÁREA → MÓDULOS → SUBMÓDULOS */
  case 1:
    $areas = read("SELECT IDAREA, NOMBRE_AREA FROM AREAS WHERE ESTADO=1 ORDER BY NOMBRE_AREA");

    foreach ($areas as &$area) {
      $area['nombre'] = $area['NOMBRE_AREA'];

      $modulos = read(
        "SELECT IDMODULO, NOMBRE_MODULO
         FROM MODULOS
         WHERE FKAREA=? AND ESTADO=1
         ORDER BY NOMBRE_MODULO",
        [$area['IDAREA']]
      );

      foreach ($modulos as &$mod) {
        $mod['nombre'] = $mod['NOMBRE_MODULO'];

        $subs = read(
          "SELECT IDSUBMODULO, NOMBRE_SUBMODULO
           FROM SUBMODULOS
           WHERE FKMODULO=? AND ESTADO=1
           ORDER BY NOMBRE_SUBMODULO",
          [$mod['IDMODULO']]
        );

        foreach ($subs as &$sub) {
          $sub['nombre'] = $sub['NOMBRE_SUBMODULO'];
        }

        $mod['hijos'] = $subs;
      }

      $area['hijos'] = $modulos;
    }

    echo json_encode($areas);
    break;

  /* 2) Padres para selects por tipo */
  case 2:
    $tipo = $_POST['tipo'] ?? '';
    $result = [];

    if ($tipo === 'modulo') {
      $result = read("SELECT IDAREA AS id, NOMBRE_AREA AS nombre
                      FROM AREAS
                      WHERE ESTADO = 1");
    } elseif ($tipo === 'submodulo') {
      $result = read("SELECT IDMODULO AS id, NOMBRE_MODULO AS nombre
                      FROM MODULOS
                      WHERE ESTADO = 1");
    } elseif ($tipo === 'subsubmodulo') {
      $result = []; // compat, ya no se usa
    }

    echo json_encode($result);
    break;

  /* 3) Submódulos de un módulo (compat; sin INDICADOR en SUBMODULOS) */
  case 3:
    $moduloId = $_POST['modulo'] ?? null;
    if (!$moduloId) jerr('Parámetro modulo requerido.');

    $result = read("
      SELECT S.IDSUBMODULO AS id, S.NOMBRE_SUBMODULO AS nombre
      FROM SUBMODULOS S
      WHERE S.FKMODULO = ? AND S.ESTADO = 1
      ORDER BY S.NOMBRE_SUBMODULO
    ", [$moduloId]);

    echo json_encode($result);
    break;

  /* 4) Módulos de un área con INDICADOR=1 (tienen submódulos) */
  case 4:
    $areaId = $_POST['area'] ?? null;
    if (!$areaId) { echo json_encode([]); break; }

    $result = read("
      SELECT M.IDMODULO AS id, M.NOMBRE_MODULO AS nombre
      FROM MODULOS M
      WHERE M.FKAREA = ? AND M.ESTADO = 1
        AND M.INDICADOR = 1
      ORDER BY M.NOMBRE_MODULO
    ", [$areaId]);

    echo json_encode($result);
    break;

  /* 5) CREAR: area | modulo | submodulo */
  case 5:
    $tipo      = $_POST['tipo'] ?? '';
    $nombre    = trim($_POST['nombre'] ?? '');
    $fk        = $_POST['fk'] ?? null;           // padre (área para módulo; módulo para submódulo)
    $icono     = trim($_POST['icono'] ?? '') ?: 'fas fa-cubes';
    $indicador = intval($_POST['indicador'] ?? 0); // módulos: 1=contenedor, 0=hoja

    if (!$tipo || !$nombre) { echo json_encode(['success'=>false,'message'=>'Datos incompletos']); break; }

    $codigo = generarCodigoAleatorio(10);

    switch ($tipo) {
      case 'area':
        write("INSERT INTO AREAS (CODIGO_AREA, NOMBRE_AREA, ESTADO) VALUES (?, ?, 1)", [$codigo, $nombre]);
        echo json_encode(['success'=>true, 'codigo'=>$codigo]);
        break;

      case 'modulo':
        if (!$fk) { echo json_encode(['success'=>false,'message'=>'Seleccione un Área (padre).']); break; }

        // Nombre del área (para prefijo de archivos)
        $area = read("SELECT NOMBRE_AREA FROM AREAS WHERE IDAREA=? LIMIT 1", [$fk]);
        $nombreArea = $area[0]['NOMBRE_AREA'] ?? 'AREA';

        // Insertar módulo
        write("INSERT INTO MODULOS (FKAREA, CODIGO_MODULO, NOMBRE_MODULO, ICONO_MODULO, INDICADOR, ESTADO)
               VALUES (?, ?, ?, ?, ?, 1)",
              [$fk, $codigo, $nombre, $icono, $indicador]);

        // Si es módulo hoja, generar archivos AREA_MODULO
        if ($indicador === 0) {
          $vista = normalizarVista($nombreArea) . '_' . normalizarVista($nombre);
          crearArchivosVista($vista);
          // Si tienes columna VISTA_MODULO, aquí podrías guardarla
          // write("UPDATE MODULOS SET VISTA_MODULO=? WHERE CODIGO_MODULO=?", [$vista, $codigo]);
        }

        echo json_encode(['success'=>true, 'codigo'=>$codigo]);
        break;

      case 'submodulo':
        if (!$fk) { echo json_encode(['success'=>false,'message'=>'Seleccione un Módulo (padre).']); break; }

        // Obtener área del módulo padre (para prefijo AREA_)
        $area = read("SELECT A.NOMBRE_AREA
                      FROM MODULOS M
                      JOIN AREAS A ON A.IDAREA = M.FKAREA
                      WHERE M.IDMODULO=? LIMIT 1", [$fk]);
        $nombreArea = $area[0]['NOMBRE_AREA'] ?? 'AREA';

        // Vista del submódulo: AREA_SUBMODULO
        $vista = normalizarVista($nombreArea) . '_' . normalizarVista($nombre);

        // Generar archivos
        crearArchivosVista($vista);

        // Insertar submódulo
        write("INSERT INTO SUBMODULOS (FKMODULO, CODIGO_SUBMODULO, NOMBRE_SUBMODULO, VISTA_SUBMODULO, ESTADO)
               VALUES (?, ?, ?, ?, 1)",
             [$fk, $codigo, $nombre, $vista]);

        echo json_encode(['success'=>true, 'codigo'=>$codigo, 'vista'=>$vista]);
        break;

      default:
        echo json_encode(['success'=>false,'message'=>'Tipo no soportado']);
        break;
    }

    break; // <- IMPORTANTÍSIMO: break del case 5 (afuera del switch interno)

  default:
    jerr('a0 no soportado.');
    break;
}
