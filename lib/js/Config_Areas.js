$(document).ready(function () {
  cargarArbol();
  cargarPadres();

  $("#tipo").on("change", function () {
    const tipo = $(this).val();

    // Mostrar u ocultar select de módulo dependiendo del tipo
    if (tipo === "subsubmodulo") {
      $("#grupoModulo").show();
      cargarModulos(); // Carga todos los módulos para seleccionar uno
      $("#grupoPadre").hide(); // Se oculta hasta que se elija el módulo
    } else {
      $("#grupoModulo").hide();
      $("#grupoPadre").show();
      cargarPadres();
    }
  });

 $("#modulo").on("change", function () {
  const idModulo = $(this).val();

  if ($("#tipo").val() === "subsubmodulo" && idModulo) {
    $.get("lib/php/Config_Areas.php", {
      action: "padres",
      tipo: "subsubmodulo",
      modulo: idModulo  // ✅ aquí enviamos el ID del módulo seleccionado
    }, function (data) {
      try {
        const json = JSON.parse(data);
        let options = `<option value="">Seleccione un submódulo</option>`;
        json.forEach((item) => {
          options += `<option value="${item.id}">${item.nombre}</option>`;
        });
        $("#padre").html(options);
        $("#grupoPadre").show();
      } catch (err) {
        console.error("Error al cargar submódulos del módulo:", err);
      }
    });
  }
});



  $("#formEstructura").on("submit", function (e) {
    e.preventDefault();
    crearElemento();
  });
});

function cargarArbol() {
  $.get("lib/php/Config_Areas.php", { action: "arbol" }, function (data) {
    try {
      const json = JSON.parse(data);
      const html = generarArbolHTML(json);
      $("#arbolSistema").html(html);
    } catch (err) {
      console.error("Error al procesar el árbol:", err);
    }
  });
}

function cargarModulos() {
  $.get("lib/php/Config_Areas.php", { action: "padres", tipo: "submodulo" }, function (data) {
    try {
      const json = JSON.parse(data);
      let options = `<option value="">Seleccione un módulo</option>`;
      json.forEach((item) => {
        options += `<option value="${item.id}">${item.nombre}</option>`;
      });
      $("#modulo").html(options);
    } catch (err) {
      console.error("Error al cargar módulos:", err);
    }
  });
}

function cargarPadres() {
  const tipo = $("#tipo").val();
  if (tipo === "area") {
    $("#padre").html(`<option value="">No aplica</option>`);
    return;
  }

  $.get("lib/php/Config_Areas.php", { action: "padres", tipo: tipo }, function (data) {
    try {
      const json = JSON.parse(data);
      let options = `<option value="">Seleccione</option>`;
      json.forEach((item) => {
        options += `<option value="${item.id}">${item.nombre}</option>`;
      });
      $("#padre").html(options);
    } catch (err) {
      console.error("Error al cargar padres:", err);
    }
  });
}

function crearElemento() {
  const tipo = $("#tipo").val();
  const fk = tipo === "subsubmodulo" ? $("#padre").val() : $("#padre").val();

  const datos = {
    tipo: tipo,
    nombre: $("#nombre").val(),
    fk: fk,
    hijos: $("#hijos").is(":checked")
  };

  $.ajax({
    url: "lib/php/Config_Areas.php",
    type: "POST",
    data: JSON.stringify(datos),
    contentType: "application/json",
    success: function (respuesta) {
      try {
        const res = JSON.parse(respuesta);
        if (res.success) {
          alert("Elemento creado con éxito");
          $("#formEstructura")[0].reset();
          cargarArbol();
          cargarPadres();
          $("#grupoModulo").hide();
          $("#grupoPadre").show();
        } else {
          alert("Error: " + res.message);
        }
      } catch (e) {
        console.error("Error al crear:", e);
      }
    }
  });
}

function generarArbolHTML(data) {
  if (!data || !Array.isArray(data)) return "";

  let html = "<ul>";
  data.forEach((item) => {
    html += `<li><i class="${item.icono || 'fas fa-folder'}"></i> ${item.nombre}`;
    if (item.hijos && item.hijos.length > 0) {
      html += generarArbolHTML(item.hijos);
    }
    html += "</li>";
  });
  html += "</ul>";

  return html;
}
