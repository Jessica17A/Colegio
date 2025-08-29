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

    const normalizar = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    const primerNombre = nombre.split(" ")[0] || "";
    const primerApellido = apellido.split(" ")[0] || "";

    if (primerNombre && primerApellido) {
      const user = `${normalizar(primerNombre.charAt(0).toLowerCase())}${normalizar(primerApellido.toLowerCase())}`;
      $("#usuario").val(user);
    }
  });

  // Enviar formulario (crear usuario)
  $("#formUsuario").on("submit", function (e) {
    e.preventDefault();
    const idPersona  = $("#personaSelect").val();
    const usuario    = $("#usuario").val();
    const contrasena = $("#contrasena").val();

    if (!idPersona || !usuario || !contrasena) {
      Swal.fire("Campos incompletos", "Todos los campos son obligatorios", "warning");
      return;
    }

    $.ajax({
      url: "lib/php/CONFIGURACIN_USUARIOS.php",
      type: "POST",
      dataType: "json",
      data: {
        action: 1,
        id_persona: idPersona,
        usuario,
        contrasena
      },
      success: function (resp) {
        Swal.fire(resp.success ? "Éxito" : "Error", resp.mensaje, resp.success ? "success" : "error");
        if (resp.success) {
          listarUsuarios();
          $("#formUsuario")[0].reset();
          $("#personaSelect").val(null).trigger("change");
        }
      },
      error: function (xhr) {
        Swal.fire("Error", "No se pudo crear el usuario. Inténtelo de nuevo.", "error");
        console.error("Crear usuario (AJAX error):", xhr.responseText || xhr.statusText);
      }
    });
  });
});

// Cargar empleados
function cargarEmpleados() {
  $.ajax({
    url: "lib/php/CONFIGURACIN_USUARIOS.php",
    type: "POST",
    dataType: "json",
    data: { action: 2 },
    success: function (data) {
      let options = `<option disabled selected>Seleccione un empleado</option>`;
      data.forEach(p => {
        options += `<option value="${p.id}" data-nombre="${p.NOMBRE}" data-apellido="${p.APELLIDO}">${p.NOMBRE} ${p.APELLIDO}</option>`;
      });
      $("#personaSelect").html(options);
    },
    error: function (xhr) {
      Swal.fire("Error", "No se pudieron cargar los empleados.", "error");
      console.error("cargarEmpleados (AJAX error):", xhr.responseText || xhr.statusText);
    }
  });
}

// Listar usuarios
function listarUsuarios() {
  $.ajax({
    url: "lib/php/CONFIGURACIN_USUARIOS.php",
    type: "POST",
    dataType: "json",
    data: { action: 3 },
    success: function (data) {
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
    },
    error: function (xhr) {
      Swal.fire("Error", "No se pudieron listar los usuarios.", "error");
      console.error("listarUsuarios (AJAX error):", xhr.responseText || xhr.statusText);
    }
  });
}

function cambiarEstado(id, nuevoEstado) {
  
  Swal.fire({
    title: "¿Está seguro?",
    text: `¿Desea cambiar estado al usuario?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, confirmar",
    cancelButtonText: "Cancelar"
  }).then((result) => {
    if (!result.isConfirmed) return;


    $.ajax({
      url: "lib/php/CONFIGURACIN_USUARIOS.php",
      type: "POST",
      data: { action: 4, id: id, estado: nuevoEstado }
    });

    // Mostrar alerta inmediata
    Swal.fire({
      icon: "success",
      title: "Correcto",
      text: `La acción se ha realizado con éxito.`
    });

    // Refrescar la tabla sin esperar confirmación del servidor
    setTimeout(() => { listarUsuarios(); }, 350);
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

  $.ajax({
    url: "lib/php/CONFIGURACIN_USUARIOS.php",
    type: "POST",
    dataType: "json",
    data: { action: 5, id, nueva },
    success: function (r) {
      Swal.fire(r.success ? "Éxito" : "Error", r.mensaje, r.success ? "success" : "error");
      const modal = bootstrap.Modal.getInstance(document.getElementById('modalReset'));
      modal.hide();
      listarUsuarios();
    },
    error: function (xhr) {
      Swal.fire("Error", "No se pudo resetear la contraseña.", "error");
      console.error("resetearConfirmado (AJAX error):", xhr.responseText || xhr.statusText);
    }
  });
}
