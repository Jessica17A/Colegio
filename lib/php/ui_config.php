<?php
require_once '../db/conexion.php';
header('Content-Type: application/json; charset=utf-8');

// 1) Traer ÁREAS activas
$areas = read("SELECT * FROM AREAS WHERE ESTADO = 1 ORDER BY NOMBRE_AREA");

$menu = [];
foreach ($areas as $area) {
  // 2) Traer MÓDULOS del área
  $modulos = read("SELECT * FROM MODULOS WHERE FKAREA = ? AND ESTADO = 1 ORDER BY NOMBRE_MODULO", [$area['IDAREA']]);

  foreach ($modulos as &$modulo) {
    // **INDICADOR EN MODULOS**
    //  - 1 = contenedor (tiene submódulos)
    //  - 0 = vista sola (no debe tener submódulos)
    $indicador = isset($modulo['INDICADOR']) ? intval($modulo['INDICADOR']) : 0;

    if ($indicador === 1) {
      // 3a) Si es contenedor, traer sus SUBMÓDULOS
      $submodulos = read("SELECT * FROM SUBMODULOS WHERE FKMODULO = ? AND ESTADO = 1 ORDER BY NOMBRE_SUBMODULO", [$modulo['IDMODULO']]);
      $modulo['SUBMODULOS'] = $submodulos;
    } else {
      // 3b) Si es vista sola, no hay submódulos; opcionalmente resolver nombre de vista
      //     Si tienes columna VISTA_MODULO, úsala; si no, la resolvemos por nombre (fallback)
      if (empty($modulo['VISTA_MODULO'])) {
        $modulo['VISTA_MODULO_RESUELTA'] = strtoupper(str_replace(' ', '_', $modulo['NOMBRE_MODULO']));
      }
      $modulo['SUBMODULOS'] = []; // para uniformidad del front
    }
  }

  $area['MODULOS'] = $modulos;
  $menu[] = $area;
}

// 4) Enviar JSON
echo json_encode($menu);
