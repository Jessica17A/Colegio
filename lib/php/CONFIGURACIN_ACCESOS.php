<?php
require_once '../db/conexion.php';

$action = isset($_POST['action']) ? intval($_POST['action']) : 0;

switch ($action) {


/* ============================================================
   1. Cargar usuarios
   ============================================================ */
case 1:

    $sql = "SELECT u.ID_USUARIO, CONCAT(p.NOMBRE, ' ', p.APELLIDO) AS NOMBRE
            FROM SEG_USUARIOS u
            JOIN Seg_Dates_Person p ON u.ID_PERSONA = p.ID_SEG_DATES_PERSON WHERE u.ESTADO = 1";

    echo json_encode(read($sql));
    break;



/* ============================================================
   2. Cargar módulos + submódulos
   ============================================================ */
case 2:

    $modulos = read("
        SELECT IDMODULO, NOMBRE_MODULO
        FROM MODULOS
        ORDER BY NOMBRE_MODULO ASC
    ");

    foreach ($modulos as &$m) {

        $m['SUBMODULOS'] = read("
            SELECT IDSUBMODULO, NOMBRE_SUBMODULO
            FROM SUBMODULOS
            WHERE FKMODULO = ?
            ORDER BY NOMBRE_SUBMODULO ASC
        ", [$m['IDMODULO']]);

    }

    echo json_encode($modulos);
    break;



/* ============================================================
   3. Obtener permisos actuales del usuario
   ============================================================ */
case 3:

    $idUsuario = $_POST['id_usuario'];

    // Módulos permitidos
    $mods = read("
        SELECT FK_MODULO 
        FROM SEG_USUARIO_MODULO
        WHERE FK_USUARIO = ? AND ESTADO = 1
    ", [$idUsuario]);

    // Submódulos permitidos
    $subs = read("
        SELECT FK_SUBMODULO 
        FROM SEG_USUARIO_SUBMODULO
        WHERE FK_USUARIO = ? AND ESTADO = 1
    ", [$idUsuario]);

    echo json_encode([
        "MODULOS"     => array_column($mods, "FK_MODULO"),
        "SUBMODULOS"  => array_column($subs, "FK_SUBMODULO")
    ]);

    break;



/* ============================================================
   4. Guardar permisos
   ============================================================ */
case 4:

    $idUsuario  = $_POST['id_usuario'];
    $modulos    = json_decode($_POST['modulos'], true);
    $submodulos = json_decode($_POST['submodulos'], true);

    // Desactivar permisos actuales
    update("UPDATE SEG_USUARIO_MODULO SET ESTADO = 0 WHERE FK_USUARIO = ?", [$idUsuario]);
    update("UPDATE SEG_USUARIO_SUBMODULO SET ESTADO = 0 WHERE FK_USUARIO = ?", [$idUsuario]);

    // Guardar módulos
    foreach ($modulos as $m) {

        $existe = read("
            SELECT 1 FROM SEG_USUARIO_MODULO
            WHERE FK_USUARIO = ? AND FK_MODULO = ?
        ", [$idUsuario, $m]);

        if ($existe) {
            update("
                UPDATE SEG_USUARIO_MODULO SET ESTADO = 1
                WHERE FK_USUARIO = ? AND FK_MODULO = ?
            ", [$idUsuario, $m]);
        } else {
            write("
                INSERT INTO SEG_USUARIO_MODULO (FK_USUARIO, FK_MODULO, ESTADO)
                VALUES (?, ?, 1)
            ", [$idUsuario, $m]);
        }
    }

    // Guardar submódulos
    foreach ($submodulos as $s) {

        $existe = read("
            SELECT 1 FROM SEG_USUARIO_SUBMODULO
            WHERE FK_USUARIO = ? AND FK_SUBMODULO = ?
        ", [$idUsuario, $s]);

        if ($existe) {
            update("
                UPDATE SEG_USUARIO_SUBMODULO SET ESTADO = 1
                WHERE FK_USUARIO = ? AND FK_SUBMODULO = ?
            ", [$idUsuario, $s]);
        } else {
            write("
                INSERT INTO SEG_USUARIO_SUBMODULO (FK_USUARIO, FK_SUBMODULO, ESTADO)
                VALUES (?, ?, 1)
            ", [$idUsuario, $s]);
        }
    }

    echo json_encode(["success" => true]);
    break;



/* ============================================================
   DEFAULT
   ============================================================ */
default:
    echo json_encode(["error" => "Acción no válida"]);
    break;

}
?>
