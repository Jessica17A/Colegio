<?php
// === Router sencillo: ?v=VISTA ===
// Default
$vista = isset($_GET['v']) ? $_GET['v'] : 'DASHBOARD';

// Normaliza: mayúsculas y espacios/guiones -> _
$vista = strtoupper(trim($vista));
$vista = preg_replace('/[\s-]+/', '_', $vista);

// Seguridad: solo A-Z 0-9 _
if (!preg_match('/^[A-Z0-9_]+$/', $vista)) {
  $vista = 'DASHBOARD';
}

// Resuelve archivo: primero .php, luego .html
$base = __DIR__ . "/lib/view/{$vista}";
$ruta = is_file($base . ".php") ? ($base . ".php")
      : (is_file($base . ".html") ? ($base . ".html") : null);

// Fallback a DASHBOARD si no existe la vista pedida
if ($ruta === null) {
  $dashBase = __DIR__ . "/lib/view/DASHBOARD";
  $ruta = is_file($dashBase . ".php") ? ($dashBase . ".php")
        : (is_file($dashBase . ".html") ? ($dashBase . ".html") : null);
}

// Si no hay ni siquiera DASHBOARD, mostramos un aviso mínimo
$contenidoNoEncontrado = ($ruta === null);

// ===============================
// NUEVO: rutas automáticas CSS/JS/PHP por nombre de vista
// ===============================
$css_rel = "lib/css/{$vista}.css";
$js_rel  = "lib/js/{$vista}.js";
$php_rel = "lib/php/{$vista}.php";

$css_abs = __DIR__ . "/{$css_rel}";
$js_abs  = __DIR__ . "/{$js_rel}";
$php_abs = __DIR__ . "/{$php_rel}";
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Mi Proyecto con AdminLTE</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <!-- CSS global -->
  <link rel="stylesheet" href="dist/css/adminlte.min.css">
  <link rel="stylesheet" href="plugins/fontawesome-free/css/all.min.css">

  <!-- NUEVO (opcional): tema de SweetAlert2 en <head> para asegurar estilos -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@sweetalert2/theme-bootstrap-4@5/bootstrap-4.min.css">

  <?php if (is_file($css_abs)): ?>
    <!-- NUEVO: CSS específico de la vista actual -->
    <link rel="stylesheet" href="<?= $css_rel ?>?v=<?= filemtime($css_abs) ?>">
  <?php endif; ?>
</head>
<body class="hold-transition sidebar-mini layout-fixed">
<div class="wrapper">

  <!-- Navbar -->
  <nav class="main-header navbar navbar-expand navbar-white navbar-light">
    <ul class="navbar-nav">
      <li class="nav-item">
        <a class="nav-link" data-widget="pushmenu" href="#"><i class="fas fa-bars"></i></a>
      </li>
      <li class="nav-item d-none d-sm-inline-block">
        <a href="?v=DASHBOARD" class="nav-link">Home</a>
      </li>
    </ul>

    <ul class="navbar-nav ml-auto">
      <li class="nav-item">
        <a href="logout.php" class="nav-link text-danger">
          <i class="fas fa-sign-out-alt"></i> Cerrar sesión
        </a>
      </li>
    </ul>
  </nav>

  <!-- Sidebar -->
  <aside class="main-sidebar sidebar-dark-primary elevation-4">
    <a href="?v=DASHBOARD" class="brand-link">
      <img src="dist/img/AdminLTELogo.png" class="brand-image img-circle elevation-3" alt="Logo">
      <span class="brand-text font-weight-light">TestLab</span>
    </a>

  <div class="sidebar">
      <!-- User -->
      <div class="user-panel mt-3 pb-3 mb-2 d-flex">
        <div class="image">
          <img src="dist/img/user2-160x160.jpg" class="img-circle elevation-2" alt="">
        </div>
        <div class="info">
          <a href="#" class="d-block">TestLab</a>
        </div>
      </div>

      <!-- Buscador -->
      <div id="sidebar-search" class="px-3 mb-2">
        <div class="input-group">
          <input id="menu-search" type="search" class="form-control form-control-sidebar" name="menu-search" placeholder="Buscar módulo o submódulo">
          <div class="input-group-append">
            <button id="menu-clear" class="btn btn-sidebar" type="button" title="Limpiar">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Menú -->
      <nav class="mt-1">
        <!-- Botón fijo Inicio -->
        <ul class="nav nav-pills nav-sidebar flex-column" role="menu">
          <li class="nav-item">
            <a href="?v=DASHBOARD" class="nav-link">
              <i class="fas fa-home nav-icon"></i>
              <p>Inicio</p>
            </a>
          </li>
        </ul>

        <!-- Menú dinámico (tu JS lo llena) -->
        <ul id="menu-dinamico"
            class="nav nav-pills nav-sidebar flex-column"
            data-widget="treeview"
            data-accordion="false"
            role="menu">
        </ul>
      </nav>
    </div>
  </aside>

  <!-- Contenido dinámico -->
  <div class="content-wrapper p-3" id="contenido-principal">
    <?php if ($contenidoNoEncontrado): ?>
      <section class="content">
        <div class="container-fluid">
          <div class="alert alert-danger">
            No se encontró la vista solicitada ni el DASHBOARD. Verifica <code>/lib/view/DASHBOARD.php</code> o <code>.html</code>.
          </div>
        </div>
      </section>
    <?php else: ?>
      <?php include $ruta; // incluye fragmento .php o .html ?>
    <?php endif; ?>
  </div>

</div>

<!-- en <head> (tema opcional) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@sweetalert2/theme-bootstrap-4@5/bootstrap-4.min.css">

<!-- antes de adminlte.min.js -->
<script src="plugins/jquery/jquery.min.js"></script>
<script src="plugins/bootstrap/js/bootstrap.bundle.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<script src="dist/js/adminlte.min.js"></script>

<!-- NUEVO: variables globales para la vista actual -->
<script>
  window.VISTA_ACTUAL = "<?= $vista ?>";
  window.VISTA_PATHS = {
    css: "<?= is_file($css_abs) ? $css_rel : '' ?>",
    js:  "<?= is_file($js_abs)  ? $js_rel  : '' ?>",
    php: "<?= is_file($php_abs) ? $php_rel : '' ?>"
  };
</script>

<?php if (is_file($js_abs)): ?>
  <!-- NUEVO: JS específico de la vista actual -->
  <script src="<?= $js_rel ?>?v=<?= filemtime($js_abs) ?>"></script>
<?php endif; ?>

<script src="lib/js/ui_config.js?v=2"></script>

</body>
</html>
