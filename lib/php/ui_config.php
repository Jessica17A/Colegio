<?php
require_once '../db/conexion.php';
header('Content-Type: application/json; charset=utf-8');


$areas = read("SELECT * FROM AREAS WHERE ESTADO = 1 ORDER BY NOMBRE_AREA");

$menu = [];
foreach ($areas as $area) {
 
  $modulos = read("SELECT * FROM MODULOS WHERE FKAREA = ? AND ESTADO = 1 ORDER BY NOMBRE_MODULO", [$area['IDAREA']]);

  foreach ($modulos as &$modulo) {
    
    $indicador = isset($modulo['INDICADOR']) ? intval($modulo['INDICADOR']) : 0;

    if ($indicador === 1) {
     
      $submodulos = read("SELECT * FROM SUBMODULOS WHERE FKMODULO = ? AND ESTADO = 1 ORDER BY NOMBRE_SUBMODULO", [$modulo['IDMODULO']]);
      $modulo['SUBMODULOS'] = $submodulos;
    } else {
  
      if (empty($modulo['VISTA_MODULO'])) {
      
        $vista = strtoupper(str_replace(' ', '_', $modulo['NOMBRE_MODULO']));
        $modulo['VISTA_MODULO'] = $vista;
        $modulo['VISTA_MODULO_RESUELTA'] = $vista;

       
      } else {
        $modulo['VISTA_MODULO_RESUELTA'] = $modulo['VISTA_MODULO'];
      }

      $modulo['SUBMODULOS'] = []; 
    }

  }

  $area['MODULOS'] = $modulos;
  $menu[] = $area;
}


echo json_encode($menu);
