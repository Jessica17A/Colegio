<?php session_start(); ?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Iniciar sesión - TestLab</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <!-- Estilos base -->
  <link rel="stylesheet" href="dist/css/adminlte.min.css">
  <link rel="stylesheet" href="plugins/fontawesome-free/css/all.min.css">
  <link rel="stylesheet" href="lib/css/custom.css">
</head>
<body class="login-illustration-bg">

<div class="login-illustration-container">
  <!-- Panel izquierdo (ilustración) -->
  <div class="login-illustration-left">
    <img src="lib/img/secure_login.svg" alt="Secure login" class="illustration-img">
  </div>

  <!-- Panel derecho (formulario) -->
  <div class="login-illustration-right">
   <div class="login-form-box">
  <h2 class="text-white text-center mb-4">¡Bienvenido!</h2>


      <form action="auth.php" method="POST">
        <div class="form-group">
          <label class="text-white" for="user"><i class="fas fa-user"></i> Usuario</label>
          <input type="text" name="user" class="form-control rounded-pill" placeholder="Ingresa tu usuario" required>
        </div>
        <div class="form-group mt-3">
          <label class="text-white" for="clave"><i class="fas fa-lock"></i> Contraseña</label>
          <input type="password" name="clave" class="form-control rounded-pill" placeholder="Ingresa tu contraseña" required>
        </div>
        <button type="submit" class="btn btn-light btn-block mt-4 rounded-pill font-weight-bold">Iniciar sesión</button>
      </form>

      <?php if (isset($_GET['error'])): ?>
        <div class="alert alert-danger mt-3 text-center rounded-pill py-2">
          <i class="fas fa-exclamation-circle"></i> <?= htmlspecialchars($_GET['error']) ?>
        </div>
      <?php endif; ?>
    </div>
  </div>
</div>

</body>
</html>
