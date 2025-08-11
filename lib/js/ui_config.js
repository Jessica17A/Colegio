

$(document).ready(function () {  


  ocultarVistaEnUrl();

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
          // Módulo contenedor con submódulos
          let submodulosHtml = '';

          (modulo.SUBMODULOS || []).forEach(sub => {
           
            const vistaSub = normalizaCodigo(sub.VISTA_SUBMODULO || generarCodigoVistaModulo(sub.NOMBRE_SUBMODULO));
            const codigoBD = (sub.CODIGO_SUBMODULO || '').trim();

            const href = codigoBD
              ? `?v=${encodeURIComponent(vistaSub)}&k=${encodeURIComponent(codigoBD)}`
              : `?v=${encodeURIComponent(vistaSub)}`;

            submodulosHtml += `
              <li class="nav-item">
                <a href="${href}" data-vista="${vistaSub}" data-code="${escapeAttr(codigoBD)}" class="nav-link">
                  <i class="${(sub.ICONO || 'fas fa-cubes').trim()} nav-icon"></i>
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
          const vistaModuloRaw = (modulo.VISTA_MODULO_RESUELTA || modulo.VISTA_MODULO || generarCodigoVistaModulo(modulo.NOMBRE_MODULO)).trim();
          const vistaModulo = normalizaCodigo(vistaModuloRaw);
          const codigoBD = (modulo.CODIGO_MODULO || '').trim();

          const href = codigoBD
            ? `?v=${encodeURIComponent(vistaModulo)}&k=${encodeURIComponent(codigoBD)}`
            : `?v=${encodeURIComponent(vistaModulo)}`;

          modulosHtml += `
            <li class="nav-item">
              <a href="${href}" data-vista="${vistaModulo}" data-code="${escapeAttr(codigoBD)}" class="nav-link">
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

  // ===== Forzar navegación al router y luego ocultar 'v' en la URL mostrando solo 'k' =====
  $('#menu-dinamico').off('click.navrouter').on('click.navrouter', 'a[data-vista]', function (e) {
   
  });

  // ===== Buscador =====
  function wireSearch() {
    const $input = $('#menu-search');
    const $clear = $('#menu-clear');

    const norm = s => String(s || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

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

      // 1) Coincidencias en hijos
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

      // 2) Coincidencias en padres (hoja o contenedores)
      $menu.find('> li.nav-item:not(.has-treeview)').each(function () {
        const $li = $(this);
        $li.toggle(norm($li.text()).includes(q));
      });

      // 3) Si el padre contenedor coincide, abrirlo con todos sus hijos
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

    $input.trigger('input');
  }

  // === Carga de vistas (compat vieja) ===
  // Ahora soporta un segundo parámetro opcional: codigoBD
  window.cargarVista = function (codigoVista, codigoBD) {
    if (!codigoVista) return;

    // Vista (para router)
    let v = String(codigoVista).trim()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[\s-]+/g, '_')
      .replace(/[^A-Za-z0-9_]/g, '')
      .toUpperCase();

    // Código BD (opcional, solo para mostrarlo en URL)
    const k = String(codigoBD || '').trim();

    const url = k
      ? `?v=${encodeURIComponent(v)}&k=${encodeURIComponent(k)}`
      : `?v=${encodeURIComponent(v)}`;

    window.location.search = url;
  };

  // === Utils ===
  function generarCodigoVistaModulo(nombre) {
    if (!nombre) return '';
    return String(nombre).trim().toUpperCase().replace(/\s+/g, '_').replace(/[^A-Z0-9_]/g, '');
  }

  function normalizaCodigo(codigo) {
    return String(codigo || '')
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[\s-]+/g, '_')
      .replace(/[^A-Za-z0-9_]/g, '')
      .toUpperCase();
  }

  function escapeHtml(str) {
    return String(str || '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function escapeAttr(str) {
    return String(str || '').replace(/"/g, '&quot;');
  }

  // Reemplaza en la barra la URL para ocultar ?v y dejar solo ?k (si existe)
  function ocultarVistaEnUrl() {
    const url = new URL(window.location.href);
    const v = url.searchParams.get('v');
    const k = url.searchParams.get('k');

    if (v && k) {
      // Deja solo ?k=... (sin recargar)
      url.searchParams.delete('v');
      const clean = url.pathname + '?' + 'k=' + encodeURIComponent(k);
      history.replaceState(null, '', clean);
    }
  }

});
