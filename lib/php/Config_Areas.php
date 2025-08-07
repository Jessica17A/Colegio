<?php
require_once '../db/conexion.php'; // Ajusta según tu estructura


function crearArchivosVista($moduloNombre, $subNombre)
{
    $vistaNombre = strtoupper(str_replace(' ', '_', $moduloNombre)) . '_' . strtoupper(str_replace(' ', '_', $subNombre));
    $carpetas = [
        'php' => "../php/{$vistaNombre}.php",
        'js' => "../js/{$vistaNombre}.js",
        'css' => "../css/{$vistaNombre}.css",
        'view' => "../view/{$vistaNombre}.html"
    ];

    foreach ($carpetas as $tipo => $ruta) {
        if (!file_exists($ruta)) {
            file_put_contents($ruta, "<!-- Archivo {$tipo} generado para {$vistaNombre} -->");
        }
    }

    return $vistaNombre;
}

function generarCodigoAleatorio($longitud = 10)
{
    return substr(str_shuffle('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'), 0, $longitud);
}

// === 0. CONSULTA PADRES DINÁMICOS ===
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'padres') {
    $tipo = $_GET['tipo'];
    $result = [];

    switch ($tipo) {
        case 'modulo':
            $result = read("SELECT IDAREA AS id, NOMBRE_AREA AS nombre FROM AREAS WHERE ESTADO = 1");
            break;

        case 'submodulo':
            $result = read("SELECT IDMODULO AS id, NOMBRE_MODULO AS nombre FROM MODULOS WHERE ESTADO = 1");
            break;

        case 'subsubmodulo':
            $moduloId = $_GET['modulo'] ?? null;
            if ($moduloId) {
               
               $result = read("
                SELECT S.IDSUBMODULO AS id, S.NOMBRE_SUBMODULO AS nombre 
                FROM SUBMODULOS S
                WHERE S.FKMODULO = ? 
                  AND S.ESTADO = 1
                  AND EXISTS (
                      SELECT 1 FROM SUBSUBMODULOS SS 
                      WHERE SS.FK_SUBMODULO = S.IDSUBMODULO 
                        AND SS.ESTADO = 1
                  )
            ", [$moduloId]);

            }
            break;
    }

    echo json_encode($result);
    exit;
}



// === 1. CONSULTA ÁRBOL COMPLETO ===
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $areas = read("SELECT * FROM AREAS WHERE ESTADO = 1");

    foreach ($areas as &$area) {
        $area['nombre'] = $area['NOMBRE_AREA'];
        $area['icono'] = 'fas fa-layer-group';
        $area['hijos'] = read("SELECT * FROM MODULOS WHERE FKAREA = ? AND ESTADO = 1", [$area['IDAREA']]);

        foreach ($area['hijos'] as &$modulo) {
            $modulo['nombre'] = $modulo['NOMBRE_MODULO'];
            $modulo['icono'] = $modulo['ICONO_MODULO'];
            $modulo['hijos'] = read("SELECT * FROM SUBMODULOS WHERE FKMODULO = ? AND ESTADO = 1", [$modulo['IDMODULO']]);

            foreach ($modulo['hijos'] as &$sub) {
                $sub['nombre'] = $sub['NOMBRE_SUBMODULO'];
                $sub['icono'] = 'fas fa-caret-right';
                $sub['hijos'] = read("SELECT * FROM SUBSUBMODULOS WHERE FK_SUBMODULO = ? AND ESTADO = 1", [$sub['IDSUBMODULO']]);

                foreach ($sub['hijos'] as &$subsub) {
                    $subsub['nombre'] = $subsub['NOMBRE_SUBSUBMODULO'];
                    $subsub['icono'] = 'fas fa-angle-double-right';
                }
            }
        }
    }

    echo json_encode($areas);
    exit;
}

// === 2. CREAR NUEVO ELEMENTO ===
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $tipo = $data['tipo'];
    $nombre = $data['nombre'];
    $fk = $data['fk'] ?? null;
    $tieneHijos = $data['hijos'] ?? false;

    $codigo = generarCodigoAleatorio();

    switch ($tipo) {
        case 'area':
            write("INSERT INTO AREAS (CODIGO_AREA, NOMBRE_AREA, ESTADO) VALUES (?, ?, 1)", [$codigo, $nombre]);
            break;

        case 'modulo':
            write("INSERT INTO MODULOS (FKAREA, CODIGO_MODULO, NOMBRE_MODULO, ICONO_MODULO, ESTADO) VALUES (?, ?, ?, 'fas fa-puzzle-piece', 1)", [$fk, $codigo, $nombre]);
            break;

        case 'submodulo':
            $moduloData = read("SELECT NOMBRE_MODULO FROM MODULOS WHERE IDMODULO = ?", [$fk]);
            $nombreModulo = $moduloData[0]['NOMBRE_MODULO'] ?? 'MODULO';
            $vista = $tieneHijos ? null : crearArchivosVista($nombreModulo, $nombre);
            write("INSERT INTO SUBMODULOS (FKMODULO, CODIGO_SUBMODULO, NOMBRE_SUBMODULO, VISTA_SUBMODULO, ESTADO) VALUES (?, ?, ?, ?, 1)", [$fk, $codigo, $nombre, $vista]);
            break;

        case 'subsubmodulo':
            $subData = read("SELECT NOMBRE_SUBMODULO FROM SUBMODULOS WHERE IDSUBMODULO = ?", [$fk]);
            $nombreSub = $subData[0]['NOMBRE_SUBMODULO'] ?? 'SUBMODULO';
            $moduloNombre = read("
                SELECT M.NOMBRE_MODULO 
                FROM MODULOS M
                JOIN SUBMODULOS S ON S.FKMODULO = M.IDMODULO
                WHERE S.IDSUBMODULO = ?
            ", [$fk]);

            $nombreModulo = $moduloNombre[0]['NOMBRE_MODULO'] ?? 'MODULO';

            $vista = crearArchivosVista($nombreModulo, $nombre);
            write("INSERT INTO SUBSUBMODULOS (FK_SUBMODULO, CODIGO_SUBSUBMODULO, NOMBRE_SUBSUBMODULO, VISTA_SUBSUBMODULO, ESTADO) VALUES (?, ?, ?, ?, 1)", [$fk, $codigo, $nombre, $vista]);
            break;
    }

    echo json_encode(['success' => true, 'codigo' => $codigo]);
    exit;
}

// === 3. ELIMINACIÓN LÓGICA ===
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    parse_str(file_get_contents("php://input"), $data);
    $tipo = $data['tipo'];
    $id = $data['id'];

    $tabla = [
        'area' => 'AREAS',
        'modulo' => 'MODULOS',
        'submodulo' => 'SUBMODULOS',
        'subsubmodulo' => 'SUBSUBMODULOS'
    ];

    if (isset($tabla[$tipo])) {
        write("UPDATE {$tabla[$tipo]} SET ESTADO = 0 WHERE ID{$tipo} = ?", [$id]);
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['error' => 'Tipo inválido']);
    }
    exit;
}



