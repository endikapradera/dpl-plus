document.addEventListener('DOMContentLoaded', function () {
  // Verificar la autenticación
  const token = localStorage.getItem('token');

  if (!token) {
    // El usuario no está autenticado, redirigir a la página de inicio de sesión
    window.location.href = '../html/auth/options.html';
  } else {
    var map = L.map('map').setView([28.448464, -16.290248], 13); // Coordenadas y nivel de zoom iniciales

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 25,
    }).addTo(map);

    // Array de plazas de aparcamiento
    let data; // Variable global para almacenar los datos del JSON
    const url = 'http://localhost:8080/api/aparcamientos/all';

    // Función para realizar una solicitud autenticada
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(response => response.json())
      .then(jsonData => {
        data = jsonData; // Almacenar los datos cargados en la variable global 'data'

        // Aquí trabajas con los datos obtenidos del JSON
        data.forEach(function (plaza) {
          var markerColor = plaza.ocupado ? 'red' : 'green';
          var marker = L.marker([plaza.latitud, plaza.longitud], {
            icon: L.divIcon({
              className: 'marker-icon',
              html: '<div class="parking-container" style="background-color:' + markerColor + '"><div>' + plaza.nombre + '</div><div>Ocupado: ' + (plaza.ocupado ? 'Sí' : 'No') + '</div></div>'
            })
          }).addTo(map);

          // Crear un rectángulo alrededor de la plaza
          var rectangle = L.rectangle([
            [plaza.latitud - 0.0001, plaza.longitud - 0.0001], // Coordenada inferior izquierda
            [plaza.latitud + 0.0001, plaza.longitud + 0.0001]  // Coordenada superior derecha
          ], { color: markerColor, weight: 1, fillOpacity: 0.4 }).addTo(map);

          var popupContent = '<h3>' + plaza.nombre + '</h3>' +
            '<p>Detalles: ' + (plaza.informacion) + '</p>' +
            '<br><button type="button" class="btn btn-primary" onclick="showRouteToPlaza(' + plaza.latitud + ',' + plaza.longitud + ')">Ir al sitio</button>';
          marker.bindPopup(popupContent, { autoPan: false });

        });
      })
      .catch(error => console.error('Error al cargar datos', error));

    // Función para mostrar la ruta a una plaza de aparcamiento
    window.showRouteToPlaza = function (latitud, longitud) {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function (position) {
          var userLat = position.coords.latitude;
          var userLng = position.coords.longitude;

          L.Routing.control({
            waypoints: [
              L.latLng(userLat, userLng),  // Ubicación actual del usuario
              L.latLng(latitud, longitud)  // Ubicación de la plaza de aparcamiento
            ],
            routeWhileDragging: true
          }).addTo(map);
        });
      } else {
        alert("Geolocalización no está disponible en tu navegador.");
      }
    }




  }
});
