$(document).ready(function () {
  cargarArbol();
  aplicarReglasUI();
  cargarPadres();

  $("#tipo option[value='subsubmodulo']").remove();

  $("#tipo").on("change", function () {
    aplicarReglasUI();
    const tipo = $("#tipo").val();

    if (tipo === "submodulo") {
      $("#grupoArea").show();
      cargarAreasParaSubmodulo();
      $("#padre").html('<option value="">Seleccione un área primero</option>');
    } else {
      $("#grupoArea").hide();
      cargarPadres();
    }
  });

  $("#area").on("change", function () {
    const idArea = $(this).val();
    if ($("#tipo").val() === "submodulo") {
      if (idArea) {
        cargarModulosConHijosPorArea(idArea);
        $("#padre").html('<option value="">Seleccione un área primero</option>');
      }
    }
  });
});

/* ====== UI ====== */
function aplicarReglasUI() {
  const tipo = $("#tipo").val();
  $("#icono").prop("disabled", tipo === "area");
  $("#indicador").prop("disabled", tipo !== "modulo");
  if (tipo !== "modulo") $("#indicador").prop("checked", false);
}

/* ====== Árbol ====== */
function cargarArbol() {
  $.ajax({
    type: "POST",
    url: "lib/php/Config_Areas.php",
    dataType: "json",
    data: { a0: 1 },
    success: function (data) {
      const html = generarArbolHTML(Array.isArray(data) ? data : []);
      $("#arbolSistema").html(html);
    },
    error: function (xhr) {
      console.error("Error árbol (a0=1):", xhr.responseText || xhr.statusText);
      $("#arbolSistema").html('<div class="text-danger">Error al cargar el árbol</div>');
    }
  });
}

function generarArbolHTML(data, nivel = 0) {
  let html = "<ul>";

  data.forEach(item => {
    // tipo por nivel: 0=Área, 1=Módulo, >=2=Submódulo
    const isArea      = (nivel === 0);
    const isModulo    = (nivel === 1);
    const isSubmodulo = (nivel >= 2);

    let clsNode = isArea ? 'area-node' : (isModulo ? 'modulo-node' : 'submodulo-node');
    let badgeCls = isArea ? 'dot-area' : (isModulo ? 'dot-modulo' : 'dot-submodulo');
    let icon = isArea ? 'fa-sitemap text-primary'
             : isModulo ? 'fa-cubes text-success'
             : 'fa-layer-group text-secondary';

    html += `
      <li class="${clsNode}">
        <i class="fas ${icon} node-line"></i>
        <span class="${badgeCls}"></span>
        <span>${escapeHtml(item.nombre || "")}</span>
        ${item.hijos && item.hijos.length ? generarArbolHTML(item.hijos, nivel + 1) : ""}
      </li>`;
  });

  html += "</ul>";
  return html;
}



/* ====== Padres ====== */
function cargarPadres() {
  const tipo = $("#tipo").val();

  if (!tipo || tipo === "area") {
    $("#padre").html('<option value="">No aplica</option>');
    return;
  }

  if (tipo === "submodulo") {
    $("#padre").html('<option value="">Seleccione un área primero</option>');
    return;
  }

  $.ajax({
    type: "POST",
    url: "lib/php/Config_Areas.php",
    dataType: "json",
    data: { a0: 2, tipo: tipo },
    success: function (data) {
      let options = '<option value="">Seleccione</option>';
      (data || []).forEach(row => {
        options += `<option value="${row.id}">${escapeHtml(row.nombre)}</option>`;
      });
      $("#padre").html(options);
    },
    error: function (xhr) {
      console.error("Error a0=2 (padres):", xhr.responseText || xhr.statusText);
      $("#padre").html('<option value="">(error)</option>');
    }
  });
}

/* ====== Submódulo ====== */
function cargarAreasParaSubmodulo() {
  $.ajax({
    type: "POST",
    url: "lib/php/Config_Areas.php",
    dataType: "json",
    data: { a0: 2, tipo: "modulo" },
    success: function (data) {
      let opts = '<option value="">Seleccione un área</option>';
      (data || []).forEach(r => opts += `<option value="${r.id}">${escapeHtml(r.nombre)}</option>`);
      $("#area").html(opts);
    },
    error: function (xhr) {
      console.error("Error a0=2 (áreas para submódulo):", xhr.responseText || xhr.statusText);
      $("#area").html('<option value="">(error)</option>');
    }
  });
}

function cargarModulosConHijosPorArea(idArea) {
  $.ajax({
    type: "POST",
    url: "lib/php/Config_Areas.php",
    dataType: "json",
    data: { a0: 4, area: idArea },
    success: function (data) {
      let opts = '<option value="">Seleccione un módulo</option>';
      (data || []).forEach(r => opts += `<option value="${r.id}">${escapeHtml(r.nombre)}</option>`);
      $("#padre").html(opts);
    },
    error: function (xhr) {
      console.error("Error a0=5 (módulos por área con hijos):", xhr.responseText || xhr.statusText);
      $("#padre").html('<option value="">(error)</option>');
    }
  });
}

/* ====== Form ====== */
$(document).on("submit", "#formEstructura", function (e) {
  e.preventDefault();
  crearElemento();
});

function crearElemento() {
  const tipo  = $("#tipo").val();
  const nombre = ($("#nombre").val() || "").trim();
  const fk     = $("#padre").val() || null;
  const icono  = ($("#icono").val() || "").trim();
  const indicador = $("#indicador").is(":checked") ? 1 : 0;

  if (!tipo)  return Swal.fire("Atención", "Seleccione el tipo.", "warning");
  if (!nombre) return Swal.fire("Atención", "Ingrese un nombre.", "warning");

  if (tipo === "modulo" && !fk)
    return Swal.fire("Atención", "Seleccione un Área (padre) para el módulo.", "warning");

  if (tipo === "submodulo") {
    const areaSel = $("#area").val();
    if (!areaSel) return Swal.fire("Atención", "Seleccione el Área para filtrar módulos.", "warning");
    if (!fk) return Swal.fire("Atención", "Seleccione el Módulo (padre) para el submódulo.", "warning");
  }

  $.ajax({
    type: "POST",
    url: "lib/php/Config_Areas.php",
    dataType: "json",
    data: { a0: 5, tipo, nombre, fk, icono, indicador },
    success: function (res) {
      if (res && res.success) {
        Swal.fire("Éxito", "Elemento creado con éxito.", "success");
        $("#formEstructura")[0].reset();
        aplicarReglasUI();
        cargarArbol();
        cargarPadres();
      } else {
        Swal.fire("Error", res?.message || "No se pudo crear.", "error");
      }
    },
    error: function (xhr) {
      console.error("Error a0=5 (crear):", xhr.responseText || xhr.statusText);
      Swal.fire("Error", "Ocurrió un error al crear el elemento.", "error");
    }
  });
}

/* ===== Utils ===== */
function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
