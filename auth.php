<?php
session_start();
require_once 'lib/db/conexion.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $user = $_POST['user'] ?? '';
    $clave = $_POST['clave'] ?? '';

    $sql = "SELECT * FROM usuarios WHERE user = ? AND estado = 2";
    $usuario = read($sql, [$user]);

    if ($usuario && password_verify($clave, $usuario[0]['password'])) {
        $_SESSION['usuario'] = [
            'id' => $usuario[0]['id'],
            'user' => $usuario[0]['user'],
            'role' => $usuario[0]['role']
        ];
        header("Location: index.html");
        exit;
    } else {
        $error = urlencode("Usuario o contraseña incorrectos.");
        header("Location: login.php?error=$error");
        exit;
    }
}

// También puedes agregar una validación por GET para revisar si la sesión está activa (opcional)
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_SESSION['usuario'])) {
        echo json_encode([
            'success' => true,
            'user' => $_SESSION['usuario']['user'],
            'role' => $_SESSION['usuario']['role']
        ]);
    } else {
        echo json_encode(['success' => false]);
    }
}
