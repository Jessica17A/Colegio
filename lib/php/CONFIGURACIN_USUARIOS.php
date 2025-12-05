<?php
require_once '../db/conexion.php';
header('Content-Type: application/json; charset=utf-8');
ob_clean();

$action = $_POST['action'] ?? 0;

switch ($action) {
  // Crear usuario
  case 1:
    $id_persona = $_POST['id_persona'];
    $usuario = $_POST['usuario'];
    $contrasena = password_hash($_POST['contrasena'], PASSWORD_DEFAULT);

    // Verifica si ya existe el usuario
    $existe = read("SELECT * FROM SEG_USUARIOS WHERE USUARIO = ?", [$usuario]);
    if ($existe) {
      echo json_encode(["success" => false, "mensaje" => "Este nombre de usuario ya existe."]);
      exit;
    }

    $sql = "INSERT INTO SEG_USUARIOS (ID_PERSONA, USUARIO, CONTRASENA, ESTADO) VALUES (?, ?, ?, 1)";
    $res = write($sql, [$id_persona, $usuario, $contrasena]);

    echo json_encode([
      "success" => $res,
      "mensaje" => $res ? "Usuario creado correctamente" : "Error al crear el usuario"
    ]);
    break;

  // Cargar empleados para el select
  case 2:
    $personas = read("SELECT ID_SEG_DATES_PERSON as id, NOMBRE, APELLIDO FROM Seg_Dates_Person WHERE ESTADO = 0" );
    echo json_encode($personas);
    break;

  // Listar usuarios
  case 3:
    $sql = "SELECT u.ID_USUARIO, CONCAT(p.NOMBRE, ' ', p.APELLIDO) as NOMBRE, u.USUARIO, u.ESTADO 
            FROM SEG_USUARIOS u
            JOIN Seg_Dates_Person p ON u.ID_PERSONA = p.ID_SEG_DATES_PERSON";
    $usuarios = read($sql);
    echo json_encode($usuarios);
    break;

  // Cambiar estado
   case 4:
    $id = $_POST["id"] ?? null;
    $estado = $_POST["estado"] ?? null;
  
    update("UPDATE SEG_USUARIOS SET ESTADO = $estado WHERE ID_USUARIO = $id");

  break;


  // Resetear contraseña
  case 5:
    $id = $_POST['id'];
    $nueva = password_hash($_POST['nueva'], PASSWORD_DEFAULT);
    $res = update("UPDATE SEG_USUARIOS SET CONTRASENA = ? WHERE ID = ?", [$nueva, $id]);

    echo json_encode([
      "success" => $res,
      "mensaje" => $res ? "Contraseña actualizada" : "Error al actualizar contraseña"
    ]);
    break;

  default:
    echo json_encode(["success" => false, "mensaje" => "Acción no válida"]);
    break;
    
}
?>
