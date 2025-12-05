$(document).ready(function () {
    cargarUsuarios();
    cargarModulosYSubmodulos();

    $("#btnGuardar").click(function () {
        guardarCambios();
    });
});


/* =====================================================
   1. Cargar lista de usuarios
   ===================================================== */
function cargarUsuarios() {

    $.ajax({
        url: "lib/php/CONFIGURACIN_ACCESOS.php",
        type: "POST",
        data: { action: 1 },
        dataType: "json",
        success: function (data) {

            $("#selectUsuario").html(`<option value="">Seleccione un usuario</option>`);

            data.forEach(u => {
                $("#selectUsuario").append(`
                    <option value="${u.ID_USUARIO}">
                        ${u.NOMBRE}
                    </option>
                `);
            });

            $("#selectUsuario").select2({ width: "100%" });

            $("#selectUsuario").on("change", function () {
                let id = $(this).val();
                if (id) cargarPermisosUsuario(id);
            });
        }
    });

}



/* =====================================================
   2. Cargar módulos y submódulos
   ===================================================== */
let estructura = [];

function cargarModulosYSubmodulos() {

    $.ajax({
        url: "lib/php/CONFIGURACIN_ACCESOS.php",
        type: "POST",
        data: { action: 2 },
        dataType: "json",
        success: function (data) {

            estructura = data;
            renderizarEstructura();
        }
    });
}



/* =====================================================
   3. Pintar estructura en pantalla
   ===================================================== */
function renderizarEstructura() {

    $("#listaPermisos").empty();

    estructura.forEach(m => {

        $("#listaPermisos").append(`
            <div class="card p-2 mb-2">

                <label class="fw-bold">
                    <input type="checkbox" class="chkModulo" value="${m.IDMODULO}">
                    ${m.NOMBRE_MODULO}
                </label>

                <div class="ms-4 mt-2">
                    ${m.SUBMODULOS.map(sub => `
                        <div>
                            <label>
                                <input type="checkbox" class="chkSub"
                                    value="${sub.IDSUBMODULO}"
                                    data-modulo="${m.IDMODULO}">
                                ${sub.NOMBRE_SUBMODULO}
                            </label>
                        </div>
                    `).join('')}
                </div>

            </div>
        `);
    });
}



/* =====================================================
   4. Cargar permisos de un usuario
   ===================================================== */
function cargarPermisosUsuario(idUsuario) {

    $(".chkModulo").prop("checked", false);
    $(".chkSub").prop("checked", false);

    $.ajax({
        url: "lib/php/CONFIGURACIN_ACCESOS.php",
        type: "POST",
        data: { action: 3, id_usuario: idUsuario },
        dataType: "json",
        success: function (r) {

            r.MODULOS.forEach(m => {
                $(`.chkModulo[value='${m}']`).prop("checked", true);
            });

            r.SUBMODULOS.forEach(s => {
                $(`.chkSub[value='${s}']`).prop("checked", true);
            });
        }
    });
}



/* =====================================================
   5. Guardar cambios
   ===================================================== */
function guardarCambios() {

    let idUsuario = $("#selectUsuario").val();

    if (!idUsuario) {
        Swal.fire("Seleccione un usuario", "", "warning");
        return;
    }

    let modulos = [];
    $(".chkModulo:checked").each(function () {
        modulos.push($(this).val());
    });

    let submodulos = [];
    $(".chkSub:checked").each(function () {
        submodulos.push($(this).val());
    });

    $.ajax({
        url: "lib/php/CONFIGURACIN_ACCESOS.php",
        type: "POST",
        data: {
            action: 4,
            id_usuario: idUsuario,
            modulos: JSON.stringify(modulos),
            submodulos: JSON.stringify(submodulos)
        },
        dataType: "json",
        success: function (r) {

            Swal.fire({
                icon: "success",
                title: "Permisos guardados",
                timer: 1500,
                showConfirmButton: false
            });

        }
    });

}
