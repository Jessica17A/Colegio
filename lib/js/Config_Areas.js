$(document).ready(function () {
  // Cargar árbol y estado inicial
  cargarArbol();
  aplicarReglasUI();
  cargarPadres();

  // Quitar opción subsubmodulo si aún está en el HTML
  $("#tipo option[value='subsubmodulo']").remove();

  // Eventos
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

  // Cuando elijan Área (para crear submódulo)
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

  // Ícono deshabilitado sólo si es Área
  $("#icono").prop("disabled", tipo === "area");

  // Indicador: habilitado sólo en Módulo (ahí decides si tendrá submódulos)
  $("#indicador").prop("disabled", tipo !== "modulo");
  if (tipo !== "modulo") $("#indicador").prop("checked", false);
}

/* ====== Árbol (a0=1) ====== */
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

function generarArbolHTML(data) {
  let html = "<ul>";
  data.forEach(item => {
    html += `
      <li>
        <i class="fas fa-folder text-warning me-1"></i> ${escapeHtml(item.nombre || "")}
        ${item.hijos && item.hijos.length ? generarArbolHTML(item.hijos) : ""}
      </li>`;
  });
  html += "</ul>";
  return html;
}

/* ====== Padres genéricos (a0=2) ====== */
function cargarPadres() {
  const tipo = $("#tipo").val();

  if (!tipo || tipo === "area") {
    $("#padre").html('<option value="">No aplica</option>');
    return;
  }

  // Si están creando SUBMÓDULO, el padre depende del área → se maneja en #area.change
  if (tipo === "submodulo") {
    $("#padre").html('<option value="">Seleccione un área primero</option>');
    return;
  }

  // Caso normal (ej. tipo = modulo): padres por tipo
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

/* ====== Flujos específicos para SUBMÓDULO ====== */
// Cargar ÁREAS (padres de módulo) para submódulo
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


// engancha el submit del formulario
$(document).on("submit", "#formEstructura", function (e) {
  e.preventDefault();
  crearElemento();
});

function crearElemento() {
  const tipo  = $("#tipo").val();
  const nombre = ($("#nombre").val() || "").trim();
  const fk     = $("#padre").val() || null;        // padre (área para módulo, módulo para submódulo)
  const icono  = ($("#icono").val() || "").trim(); // solo se usa realmente en módulo
  const indicador = $("#indicador").is(":checked") ? 1 : 0; // aplica a módulo (contenedor=1)

  // Validaciones rápidas
  if (!tipo)  return alert("Seleccione el tipo.");
  if (!nombre) return alert("Ingrese un nombre.");

  if (tipo === "modulo" && !fk)      return alert("Seleccione un Área (padre) para el módulo.");
  if (tipo === "submodulo") {
    const areaSel = $("#area").val(); // si agregaste el select de área para submódulo
    if (!areaSel) return alert("Seleccione el Área para filtrar módulos.");
    if (!fk)      return alert("Seleccione el Módulo (padre) para el submódulo.");
  }

  $.ajax({
    type: "POST",
    url: "lib/php/Config_Areas.php",
    dataType: "json",
    data: { a0: 5, tipo, nombre, fk, icono, indicador},
    success: function (res) {
      if (res && res.success) {
        alert("Creado con éxito.");
        $("#formEstructura")[0].reset();
        aplicarReglasUI();
        cargarArbol();   // refresca tu árbol (a0=1)
        cargarPadres();  // refresca combos
      } else {
        alert(res?.message || "No se pudo crear.");
      }
    },
    error: function (xhr) {
      console.error("Error a0=5 (crear):", xhr.responseText || xhr.statusText);
      alert("Error al crear.");
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
