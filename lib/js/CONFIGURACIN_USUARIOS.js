$(document).ready(function () {
  cargarEmpleados();
  listarUsuarios();

  // Inicializar Select2
  $("#personaSelect").select2({
    placeholder: "Seleccione un empleado",
    width: '100%',
    dropdownParent: $("#formUsuario").parent()
  });

  // Autogenerar usuario
  $("#personaSelect").on("change", function () {
    const nombre = $(this).find("option:selected").data("nombre") || "";
    const apellido = $(this).find("option:selected").data("apellido") || "";

    // Elimina tildes
    const normalizar = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    const primerNombre = nombre.split(" ")[0] || "";
    const primerApellido = apellido.split(" ")[0] || "";

    if (primerNombre && primerApellido) {
      const user = `${normalizar(primerNombre.charAt(0).toLowerCase())}${normalizar(primerApellido.toLowerCase())}`;
      $("#usuario").val(user);
    }
  });

  // Enviar formulario
  $("#formUsuario").on("submit", function (e) {
    e.preventDefault();
    const idPersona = $("#personaSelect").val();
    const usuario = $("#usuario").val();
    const contrasena = $("#contrasena").val();

    if (!idPersona || !usuario || !contrasena) {
      Swal.fire("Campos incompletos", "Todos los campos son obligatorios", "warning");
      return;
    }

    $.post("lib/php/CONFIGURACIN_USUARIOS.php", {
      action: 1,
      id_persona: idPersona,
      usuario,
      contrasena
    }, function (resp) {
      Swal.fire(resp.success ? "Éxito" : "Error", resp.mensaje, resp.success ? "success" : "error");
      if (resp.success) {
        listarUsuarios();
        $("#formUsuario")[0].reset();
        $("#personaSelect").val(null).trigger("change");
      }
    }, "json");
  });
});

// Cargar empleados
function cargarEmpleados() {
  $.post("lib/php/CONFIGURACIN_USUARIOS.php", { action: 2 }, function (data) {
    let options = `<option disabled selected>Seleccione un empleado</option>`;
    data.forEach(p => {
      options += `<option value="${p.id}" data-nombre="${p.NOMBRE}" data-apellido="${p.APELLIDO}">${p.NOMBRE} ${p.APELLIDO}</option>`;
    });
    $("#personaSelect").html(options);
  }, "json");
}

// Listar usuarios
function listarUsuarios() {
  $.post("lib/php/CONFIGURACIN_USUARIOS.php", { action: 3 }, function (data) {
    let html = "";
    data.forEach(u => {
      const estadoActivo = u.ESTADO == 1;
      const nuevoEstado = estadoActivo ? 0 : 1;

      html += `<tr>
        <td>${u.NOMBRE}</td>
        <td>${u.USUARIO}</td>
        <td><span class="badge ${estadoActivo ? 'bg-success' : 'bg-danger'}">${estadoActivo ? 'Activo' : 'Inactivo'}</span></td>
        <td>
          <button class="btn btn-sm btn-warning me-1" title="Resetear contraseña" onclick="abrirModalReset(${u.ID_USUARIO})">
            <i class="fas fa-sync-alt"></i>
          </button>
          <button class="btn btn-sm btn-${estadoActivo ? 'danger' : 'success'}" 
                  title="${estadoActivo ? 'Desactivar usuario' : 'Activar usuario'}"
                  onclick="cambiarEstado(${u.ID_USUARIO}, ${nuevoEstado})">
            ${estadoActivo ? 'Desactivar' : 'Activar'}
          </button>
        </td>
      </tr>`;
    });
    $("#tablaUsuarios").html(html);
  }, "json");
}


function cambiarEstado(id, nuevoEstado) {
  const accionTexto = nuevoEstado === 1 ? 'activar' : 'desactivar';

  Swal.fire({
    title: "¿Está seguro?",
    text: `¿Desea ${accionTexto} este usuario?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, confirmar",
    cancelButtonText: "Cancelar"
  }).then((result) => {
    if (result.isConfirmed) {
      $.post("lib/php/CONFIGURACIN_USUARIOS.php", {
        action: 4,
        id: id,
        estado: nuevoEstado
      });

      Swal.fire({
        icon: "success",
        title: "Correcto",
        text: `El usuario fue ${accionTexto} correctamente.`
      });

      listarUsuarios();
    }
  });
}

// Abrir modal reset
function abrirModalReset(id) {
  $("#resetId").val(id);
  $("#nuevaPass").val("");
  const modal = new bootstrap.Modal(document.getElementById('modalReset'));
  modal.show();
}

// Confirmar reset
function resetearConfirmado() {
  const id = $("#resetId").val();
  const nueva = $("#nuevaPass").val();

  if (!nueva) {
    Swal.fire("Campo requerido", "Ingrese la nueva contraseña", "warning");
    return;
  }

  $.post("lib/php/CONFIGURACIN_USUARIOS.php", { action: 5, id, nueva }, function (r) {
    Swal.fire(r.success ? "Éxito" : "Error", r.mensaje, r.success ? "success" : "error");
    const modal = bootstrap.Modal.getInstance(document.getElementById('modalReset'));
    modal.hide();
    listarUsuarios();
  }, "json");
}
