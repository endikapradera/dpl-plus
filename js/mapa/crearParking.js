document.addEventListener('DOMContentLoaded', function () {
  // Verificar la autenticación
  const token = localStorage.getItem('token');

  if (!token) {
    // El usuario no está autenticado, redirigir a la página de inicio de sesión
    window.location.href = '../html/auth/options.html';
  } else {
    const nuevoAparcamientoForm = document.getElementById('nuevoAparcamientoForm');
    const url = 'http://localhost:8080/api/parking/crear';
    const municipiosUrl = 'http://localhost:8080/api/municipios/all';

    nuevoAparcamientoForm.addEventListener('submit', function (event) {
      event.preventDefault();

      // Obtener valores del formulario
      const nombre = document.getElementById('nombre').value;
      const latitud = parseFloat(document.getElementById('latitud').value);
      const longitud = parseFloat(document.getElementById('longitud').value);
      const plazasTotales = parseInt(document.getElementById('plazasTotales').value);
      const precioMinuto = parseFloat(document.getElementById('precioMinuto').value);
      const plazasDisponibles = parseInt(document.getElementById('plazasDisponibles').value);
      const municipio = parseInt(document.getElementById('municipioFilter').value);

      // Crear objeto de aparcamiento
      const nuevoAparcamiento = {
        nombre: nombre,
        latitud: latitud,
        longitud: longitud,
        plazasTotales: plazasTotales,
        precioMinuto: precioMinuto,
        plazasDisponibles: plazasDisponibles,
        parkingMunicipioId: municipio,
      };
      // Enviar aparcamiento mediante fetch
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(nuevoAparcamiento),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Error al crear el nuevo aparcamiento');
          }
          return response.json();
        })
        .then(data => {
          // Manejar la respuesta (puedes redirigir, mostrar un mensaje, etc.)
          alert('Aparcamiento creado con éxito:', data);
          window.location.href = '../html/mapaPago.html';

        })
        .catch(error => {
          alert('Error al crear el nuevo aparcamiento', error);
        });
    });


    // Función para realizar una solicitud autenticada y cargar los municipios
    fetch(municipiosUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(response => response.json())
      .then(municipiosData => {
        // Limpiar el select antes de agregar nuevas opciones
        municipioFilter.innerHTML = '<option value="">Seleccionar Municipio</option>';

        // Iterar sobre los municipios y agregar opciones al select
        municipiosData.forEach(municipio => {
          const option = document.createElement('option');
          option.value = municipio.idMunicipio;
          option.textContent = `${municipio.idMunicipio}.- ${municipio.nombre}`;
          municipioFilter.appendChild(option);
        });
      })
      .catch(error => {
        console.error('Error al cargar datos de municipios', error);
        mostrarError('Error al cargar datos de municipios. Inténtalo de nuevo más tarde.');
      });
  }
});

