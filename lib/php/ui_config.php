<?php
require_once '../db/conexion.php';


$areas = read("SELECT * FROM AREAS WHERE ESTADO = 1");

$menu = [];
foreach ($areas as $area) {
  $modulos = read("SELECT * FROM MODULOS WHERE FKAREA = ? AND ESTADO = 1", [$area['IDAREA']]);
  foreach ($modulos as &$modulo) {
    $submodulos = read("SELECT * FROM SUBMODULOS WHERE FKMODULO = ? AND ESTADO = 1", [$modulo['IDMODULO']]);
    foreach ($submodulos as &$sub) {
      $subsubmodulos = read("SELECT * FROM SUBSUBMODULOS WHERE FK_SUBMODULO = ? AND ESTADO = 1", [$sub['IDSUBMODULO']]);
      $sub['SUBSUBMODULOS'] = $subsubmodulos;
    }
    $modulo['SUBMODULOS'] = $submodulos;
  }
  $area['MODULOS'] = $modulos;
  $menu[] = $area;
}


echo json_encode($menu);
