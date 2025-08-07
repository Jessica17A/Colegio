$(document).ready(function () {
  $.ajax({
    url: './lib/php/ui_config.php',
    method: 'GET',
    dataType: 'json',
    success: function (data) {
      generarMenu(data);
    },
    error: function (xhr, status, error) {
      console.error("Error cargando el menú:", error);
    }
  });

  function generarMenu(areas) {
    let menuHtml = '';

    areas.forEach(area => {
      let modulosHtml = '';

      area.MODULOS.forEach(modulo => {
        let submodulosHtml = '';

        modulo.SUBMODULOS.forEach(sub => {
          let subsubHtml = '';

          // Si tiene sub-submódulos
          if (sub.SUBSUBMODULOS && sub.SUBSUBMODULOS.length > 0) {
            sub.SUBSUBMODULOS.forEach(subsub => {
              subsubHtml += `
                <li class="nav-item">
                  <a href="#" class="nav-link" onclick="cargarVista('${subsub.VISTA_SUBSUBMODULO}')">
                    <i class="far fa-dot-circle nav-icon"></i>
                    <p>${subsub.NOMBRE_SUBSUBMODULO}</p>
                  </a>
                </li>`;
            });

            submodulosHtml += `
              <li class="nav-item has-treeview">
                <a href="#" class="nav-link">
                  <i class="far fa-circle nav-icon"></i>
                  <p>
                    ${sub.NOMBRE_SUBMODULO}
                    <i class="right fas fa-angle-left"></i>
                  </p>
                </a>
                <ul class="nav nav-treeview">
                  ${subsubHtml}
                </ul>
              </li>`;
          } else {
            // Si no tiene sub-submódulos, se comporta como vista
            submodulosHtml += `
              <li class="nav-item">
                <a href="#" class="nav-link" onclick="cargarVista('${sub.VISTA_SUBMODULO}')">
                  <i class="far fa-circle nav-icon"></i>
                  <p>${sub.NOMBRE_SUBMODULO}</p>
                </a>
              </li>`;
          }
        });

        modulosHtml += `
          <li class="nav-item has-treeview">
            <a href="#" class="nav-link">
              <i class="${modulo.ICONO_MODULO} nav-icon"></i>
              <p>
                ${modulo.NOMBRE_MODULO}
                <i class="right fas fa-angle-left"></i>
              </p>
            </a>
            <ul class="nav nav-treeview">
              ${submodulosHtml}
            </ul>
          </li>`;
      });

      menuHtml += `
        <li class="nav-header">${area.NOMBRE_AREA}</li>
        ${modulosHtml}`;
    });

    $('#menu-dinamico').html(menuHtml);
  }

  // Carga la vista desde la ruta basada en el código
  window.cargarVista = function (codigo) {
    $('#contenido-principal').load(`lib/view/${codigo}.html`);
  };
});
