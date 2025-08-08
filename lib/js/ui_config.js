// lib/js/ui_config.js


$(document).ready(function () {
  
  $.ajax({
    url: './lib/php/ui_config.php',
    method: 'GET',
    dataType: 'json',
    cache: false,
    success: function (data) {
      try {
        if (!Array.isArray(data) || !data.length) {
          $('#menu-dinamico').html('<li class="nav-header">Sin datos</li>');
          wireSearch(); 
          return;
        }
        generarMenu(data);
      } catch (e) {
        console.error("Error procesando el menú:", e, data);
        $('#menu-dinamico').html('<li class="nav-header text-danger">Error al generar menú</li>');
      }
    },
    error: function (xhr, status, error) {
      console.error("Error cargando el menú:", error, xhr.responseText);
      $('#menu-dinamico').html('<li class="nav-header text-danger">No se pudo cargar el menú</li>');
    }
  });

  function generarMenu(areas) {
    let menuHtml = '';

    areas.forEach(area => {
      let modulosHtml = '';

      (area.MODULOS || []).forEach(modulo => {
        const indicador = Number(modulo.INDICADOR || 0); 

        if (indicador === 1) {
        
          let submodulosHtml = '';

          (modulo.SUBMODULOS || []).forEach(sub => {
            submodulosHtml += `
              <li class="nav-item">
                <a href="#" class="nav-link" onclick="cargarVista('${(sub.VISTA_SUBMODULO || '').trim()}'); return false;">
                  <i class="far fa-circle nav-icon"></i>
                  <p>${escapeHtml(sub.NOMBRE_SUBMODULO || '')}</p>
                </a>
              </li>`;
          });

          modulosHtml += `
            <li class="nav-item has-treeview">
              <a href="#" class="nav-link">
                <i class="${(modulo.ICONO_MODULO || 'fas fa-cubes').trim()} nav-icon"></i>
                <p>
                  ${escapeHtml(modulo.NOMBRE_MODULO || '')}
                  <i class="right fas fa-angle-left"></i>
                </p>
              </a>
              <ul class="nav nav-treeview">
                ${submodulosHtml}
              </ul>
            </li>`;
        } else {
          // Módulo hoja (link directo)
          const vistaModulo = (modulo.VISTA_MODULO_RESUELTA || modulo.VISTA_MODULO || generarCodigoVistaModulo(modulo.NOMBRE_MODULO)).trim();
          modulosHtml += `
            <li class="nav-item">
              <a href="#" class="nav-link" onclick="cargarVista('${vistaModulo}'); return false;">
                <i class="${(modulo.ICONO_MODULO || 'fas fa-cubes').trim()} nav-icon"></i>
                <p>${escapeHtml(modulo.NOMBRE_MODULO || '')}</p>
              </a>
            </li>`;
        }
      });

      menuHtml += `
        <li class="nav-header">${escapeHtml(area.NOMBRE_AREA || '')}</li>
        ${modulosHtml}`;
    });

    $('#menu-dinamico').html(menuHtml);

    
    wireSearch();
  }

  // Función para limpiar el menú y buscar
function wireSearch() {
    const $input = $('#menu-search');
    const $clear = $('#menu-clear');

    const norm = s => String(s || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, ''); // quita acentos

    $input.off('input keyup').on('input keyup', function () {
      const q = norm($(this).val());
      const $menu = $('#menu-dinamico');
      const $items = $menu.find('li.nav-item');
      const $parents = $menu.find('li.has-treeview');

      // Reset
      $items.hide();
      $parents.removeClass('menu-open menu-is-opening')
              .children('ul.nav-treeview').hide();

      if (!q) {
        $items.show();
        toggleHeaders();
        return;
      }

      // 1) Coincidencias en hijos: mostrar hijo y abrir padre
      $menu.find('li.has-treeview').each(function () {
        const $parent = $(this);
        const $children = $parent.children('ul.nav-treeview').children('li.nav-item');
        let matchChild = false;

        $children.each(function () {
          const $child = $(this);
          if (norm($child.text()).includes(q)) {
            $child.show();
            matchChild = true;
          } else {
            $child.hide();
          }
        });

        if (matchChild) {
          $parent.show().addClass('menu-open menu-is-opening');
          $parent.children('ul.nav-treeview').show();
        } else {
          $parent.hide();
        }
      });

      // 2) Coincidencias en padres (módulos hoja o contenedores)
      $menu.find('> li.nav-item:not(.has-treeview)').each(function () {
        const $li = $(this);
        if (norm($li.text()).includes(q)) {
          $li.show();
        } else {
          $li.hide();
        }
      });

      // 3) Si el padre contenedor coincide por sí mismo, ábrelo y muestra todos sus hijos
      $parents.each(function () {
        const $parent = $(this);
        if (norm($parent.text()).includes(q)) {
          $parent.show().addClass('menu-open menu-is-opening');
          $parent.children('ul.nav-treeview').show().children('li.nav-item').show();
        }
      });

      toggleHeaders();
    });

    $clear.off('click').on('click', function () {
      $input.val('').trigger('input').focus();
    });

    function toggleHeaders() {
      const $menu = $('#menu-dinamico');
      $menu.find('li.nav-header').each(function () {
        const $hdr = $(this);
        const anyVisible = $hdr.nextUntil('li.nav-header').filter(':visible').length > 0;
        $hdr.toggle(anyVisible);
      });
    }

    // Dispara una vez para estado inicial
    $input.trigger('input');
}

  // === Carga de vistas ===
  window.cargarVista = function (codigo) {
    if (!codigo) return;
    $('#contenido-principal').load(`lib/view/${codigo}.html`, function (response, status, xhr) {
      if (status === "error") {
        console.error("Error cargando vista:", xhr.statusText);
        $('#contenido-principal').html(
          `<div class="p-3">
             <div class="alert alert-danger mb-2">
               No se pudo cargar la vista <strong>${escapeHtml(codigo)}</strong>.
             </div>
             <pre class="small text-muted">${escapeHtml(xhr.responseText || '')}</pre>
           </div>`
        );
      }
    });
  };

  // === Utils ===
  function generarCodigoVistaModulo(nombre) {
    if (!nombre) return '';
    return String(nombre).trim().toUpperCase().replace(/\s+/g, '_').replace(/[^A-Z0-9_]/g, '');
  }

  function escapeHtml(str) {
    return String(str || '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }
});
