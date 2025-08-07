function cargarVista(nombreVista) {
  fetch(`lib/view/${nombreVista}.html`)
    .then(res => res.ok ? res.text() : Promise.reject('No se pudo cargar la vista'))
    .then(html => {
      document.getElementById('contenido-principal').innerHTML = html;
    })
    .catch(err => {
      document.getElementById('contenido-principal').innerHTML = `<div class="alert alert-danger">${err}</div>`;
    });
}
