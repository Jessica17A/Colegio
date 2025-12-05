<?php
session_start();
require_once 'lib/db/conexion.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $user  = $_POST['user'] ?? '';
    $clave = $_POST['clave'] ?? '';

    // BUSCAR usuario real
    $sql = "SELECT * FROM seg_usuarios WHERE USUARIO = ? AND ESTADO = 1";
    $usuario = read($sql, [$user]);

    if ($usuario && password_verify($clave, $usuario[0]['CONTRASENA'])) {

        // Crear sesión
        $_SESSION['usuario'] = [
            'id'      => $usuario[0]['ID_USUARIO'],
            'persona' => $usuario[0]['ID_PERSONA'],
            'user'    => $usuario[0]['USUARIO'],
            'estado'  => $usuario[0]['ESTADO']
        ];

        header("Location: index.php?v=DASHBOARD");
        exit;
    } else {
        $error = urlencode("Usuario o contraseña incorrectos.");
        header("Location: login.php?error=$error");
        exit;
    }
}


if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_SESSION['usuario'])) {
        echo json_encode(['success' => true, 'user' => $_SESSION['usuario']['user']]);
    } else {
        echo json_encode(['success' => false]);
    }
}
