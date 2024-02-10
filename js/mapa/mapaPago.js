document.addEventListener('DOMContentLoaded', function () {
  // Verificar la autenticación
  const token = localStorage.getItem('token');

  if (!token) {
    // El usuario no está autenticado, redirigir a la página de inicio de sesión
    window.location.href = '../html/auth/options.html';
  } else {
    var map = L.map('map').setView([28.448464, -16.290248], 11); // Coordenadas y nivel de zoom iniciales

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 25,
    }).addTo(map);
    
    // Array de plazas de aparcamiento
    let data; // Variable global para almacenar los datos del JSON
    const url = 'http://localhost:8080/api/parking/all'
    
    fetch(url,
      {
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
              html: '<div class="parking-container" style="background-color:' + markerColor + '"><div>' + plaza.nombre + '</div><div>Libre: ' + 'Sí' + '</div></div>'
            })
          }).addTo(map);
          var popupContent = '<h3>' + plaza.nombre + '</h3>' +
            "<p><strong>Plazas Totales:</strong> " + plaza.plazasTotales + "</p>" +
            "<p><strong>Plazas Disponibles:</strong> " + plaza.plazasDisponibles + "</p>" +
          "<br><button class='btn btn-primary' onclick='showRouteToPlaza(" + plaza.latitud + "," + plaza.longitud + ")'>Ir al sitio</button>";
          marker.bindPopup(popupContent, { autoPan: false });
        });
      })
      .catch(error => console.error('Error al cargar el archivo JSON:', error));
        
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
