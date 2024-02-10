// Declarar aparcamientos como una variable global
let aparcamientos = [];

document.addEventListener('DOMContentLoaded', function () {
  // Verificar la autenticación
  const token = localStorage.getItem('token');

  if (!token) {
    // El usuario no está autenticado, redirigir a la página de inicio de sesión
    window.location.href = '../html/auth/options.html';
  } else {
    const aparcamientosTableBody = document.getElementById('aparcamientosTableBody');
    const municipioFilter = document.getElementById('municipioFilter');

    // URL del endpoint para obtener todos los aparcamientos
    const aparcamientosUrl = 'http://localhost:8080/api/aparcamientos/all';
    // URL del endpoint para obtener todos los municipios
    const municipiosUrl = 'http://localhost:8080/api/municipios/all';

    // Función para realizar una solicitud autenticada y cargar los aparcamientos
    fetch(aparcamientosUrl, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
  })
      .then(response => response.json())
      .then(data => {
          // Almacenar los aparcamientos cargados en la variable global
          aparcamientos = data;
          console.log(aparcamientos);
          // Limpiar el cuerpo de la tabla antes de agregar nuevas filas
          aparcamientosTableBody.innerHTML = '';
        
          // Iterar sobre los aparcamientos y agregar filas a la tabla
          data.forEach(aparcamiento => {
              const newRow = `
                  <tr>
                      <th scope="row">${aparcamiento.id}</th>
                      <td>${aparcamiento.nombre}</td>
                      <td>${aparcamiento.informacion}</td>
                      <td>${aparcamiento.ocupado ? 'Sí' : 'No'}</td>
                      
                  </tr>
              `;
              aparcamientosTableBody.innerHTML += newRow;
          });
      })
      .catch(error => {
          mostrarError('Error al cargar datos de aparcamientos. Inténtalo de nuevo más tarde.');
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

    // Escuchar eventos de cambio en el select para filtrar por municipio
    municipioFilter.addEventListener('change', filtrarPorMunicipio);
  }

  /*OBTENER PARKINGS */
  // Obtener referencia a la tbody de la tabla
  var tbody = document.getElementById('parkingTableBody');

  // URL del backend para obtener el listado de parkings
  var url = 'http://localhost:8080/api/parking/all';

  // Realizar la solicitud fetch
  // Realizar la solicitud fetch con token de autenticación
  fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  })
    .then(response => response.json())
    .then(data => {
      // Iterar sobre los datos y agregar filas a la tabla
      // Limpiar el cuerpo de la tabla antes de agregar nuevas filas
      tbody.innerHTML = '';

      // Iterar sobre los datos y agregar filas a la tabla
      data.forEach(parking => {
        var row = tbody.insertRow();
        var idCell = row.insertCell(0);
        var nombreCell = row.insertCell(1);
        var plazasTotalesCell = row.insertCell(2);
        var precioMinutoCell = row.insertCell(3);
        var plazasDispo = row.insertCell(4);

        idCell.textContent = parking.parkingId;
        nombreCell.textContent = parking.nombre;
        plazasTotalesCell.textContent = parking.plazasTotales;
        precioMinutoCell.textContent = parking.precioMinuto;
        plazasDispo.textContent = parking.plazasDisponibles;
      });
    })
    .catch(error => {
      console.error('Error al cargar datos de parkings', error);
    });

  // Funciones
  // Función para filtrar aparcamientos por ID de municipio
  function filtrarPorMunicipio() {
    const selectedMunicipioId = document.getElementById('municipioFilter').value;

    if (selectedMunicipioId) {
      // Realizar la filtración basada en el municipio seleccionado
      const filteredAparcamientos = aparcamientos.filter(aparcamiento => aparcamiento.aparcamientoMunicipioId == selectedMunicipioId);
      console.log(filteredAparcamientos);
      if (filteredAparcamientos.length > 0) {
        // Mostrar solo los aparcamientos filtrados
        displayAparcamientos(filteredAparcamientos);
        ocultarError();
      } else {
        mostrarError('No se encontraron aparcamientos para el municipio seleccionado.');
      }
    } else {
      // Si no hay municipio seleccionado, mostrar todos los aparcamientos
      displayAparcamientos(aparcamientos);
      ocultarError();
    }
  }
  // Función para mostrar aparcamientos en la tabla
  function displayAparcamientos(aparcamientos) {
    // Limpiar el cuerpo de la tabla antes de agregar nuevas filas
    aparcamientosTableBody.innerHTML = '';

    // Iterar sobre los aparcamientos y agregar filas a la tabla
    aparcamientos.forEach(aparcamiento => {
      const newRow = `
        <tr>
          <th scope="row">${aparcamiento.id}</th>
          <td>${aparcamiento.nombre}</td>
          <td>${aparcamiento.informacion}</td>
          <td>${aparcamiento.ocupado ? 'Sí' : 'No'}</td>
        </tr>
      `;
      aparcamientosTableBody.innerHTML += newRow;
    });
  }
  // Función para mostrar un mensaje de error en la página
  function mostrarError(mensaje) {
    mensajeError.textContent = mensaje;
    mensajeError.style.display = 'block';
  }
  // Función para ocultar el mensaje de error
  function ocultarError() {
    mensajeError.textContent = '';
    mensajeError.style.display = 'none';
  }

  
});

