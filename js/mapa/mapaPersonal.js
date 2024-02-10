document.addEventListener('DOMContentLoaded', function () {
  // Verificar la autenticación
  const token = localStorage.getItem('token');

  if (!token) {
    // El usuario no está autenticado, redirigir a la página de inicio de sesión
    window.location.href = '../html/auth/options.html';
  } else {
    var map = L.map('map').setView([28.20500, -16.290100], 10); // Coordenadas y nivel de zoom iniciales

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 25,
    }).addTo(map);

    // Array de plazas de aparcamiento
    let data; // Variable global para almacenar los datos del JSON
    const url = 'http://localhost:8080/api/aparcamientosprivados/all'

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
            "<p>" + plaza.informacion + "</p>" +
            "<br><button class='btn btn-primary' onclick='showRouteToPlaza(" + plaza.latitud + "," + plaza.longitud + ")'>Ir al sitio</button>" +
            "<br><br><button class='btn btn-outline-success' onclick='markArrival(" + data.indexOf(plaza) + ")'>He llegado</button>" +
            "<button class='btn btn-outline-danger' onclick='markDeparture(" + data.indexOf(plaza) + ")'>Abandono</button>";
          marker.bindPopup(popupContent, { autoPan: false });
        });
      })
      .catch(error => console.error('Error al cargar el archivo JSON:', error));

    // Función para marcar llegada a la plaza
    window.markArrival = function (index) {
      if (data) {
        data[index].ocupado = true; // Actualizar el estado de ocupación en 'data'
        updateMarkerColor(index);
      }
    }

    // Función para marcar salida de la plaza
    window.markDeparture = function (index) {
      if (data) {
        data[index].ocupado = false; // Actualizar el estado de ocupación en 'data'
        updateMarkerColor(index);
      }
    }

    // Función para actualizar el color del marcador
    window.updateMarkerColor = function (index) {
      if (data) {
        var plaza = data[index];
        var markerColor = plaza.ocupado ? 'red' : 'green';
        map.eachLayer(function (layer) {
          if (layer instanceof L.Marker && layer.getLatLng().equals([plaza.latitud, plaza.longitud])) {
            var popup = layer.getPopup();
            if (popup) {
              popup.setContent('<h3>' + plaza.nombre + '</h3>' +
                "<p>" + plaza.informacion + "</p>" +
                "<br><button class='btn btn-primary' onclick='showRouteToPlaza(" + plaza.latitud + "," + plaza.longitud + ")'>Ir al sitio</button>" +
                "<br><br><button class='btn btn-outline-success' onclick='markArrival(" + data.indexOf(plaza) + ")'>He llegado</button>" +
                "<button class='btn btn-outline-danger' onclick='markDeparture(" + data.indexOf(plaza) + ")'>Abandono</button>");
            }
            layer.setIcon(L.divIcon({
              className: 'marker-icon',
              html: '<div class="parking-container" style="background-color:' + markerColor + '"><div>' + plaza.nombre + '</div><div>Ocupado: ' + (plaza.ocupado ? 'Sí' : 'No') + '</div></div>'
            }));
          }
        });
      }
    }

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


    //Agregar sitio
    window.addParkingLocation = function () {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function (position) {
          var userLat = position.coords.latitude;
          var userLng = position.coords.longitude;

          var nombreSitio = prompt("Introduce el nombre del nuevo sitio de aparcamiento:");
          if (nombreSitio) {
            var newPlaza = {
              nombre: nombreSitio,
              latitud: userLat,
              longitud: userLng,
              informacion: "Esta es la información de " + nombreSitio,
              ocupado: false
            };

            // Agregar el nuevo aparcamiento a la variable 'data'
            if (!Array.isArray(data)) {
              data = []; // Si 'data' no es un arreglo, se inicializa como un arreglo vacío
            }
            data.push(newPlaza);

            var markerColor = newPlaza.ocupado ? 'red' : 'green';
            var marker = L.marker([userLat, userLng], {
              icon: L.divIcon({
                className: 'marker-icon',
                html: '<div class="parking-container" style="background-color:' + markerColor + '"><div>' + newPlaza.nombre + '</div><div>Ocupado: ' + (newPlaza.ocupado ? 'Sí' : 'No') + '</div></div>'
              })
            }).addTo(map);

            var popupContent = '<h3>' + plaza.nombre + '</h3>' +
            "<p>" + plaza.informacion + "</p>" +
            "<br><button class='btn btn-primary' onclick='showRouteToPlaza(" + plaza.latitud + "," + plaza.longitud + ")'>Ir al sitio</button>" +
            "<br><br><button class='btn btn-outline-success' onclick='markArrival(" + data.indexOf(plaza) + ")'>He llegado</button>" +
            "<button class='btn btn-outline-danger' onclick='markDeparture(" + data.indexOf(plaza) + ")'>Abandono</button>";
            marker.bindPopup(popupContent, { autoPan: false });
          }
        });
      } else {
        alert("Geolocalización no está disponible en tu navegador.");
      }
    }

  }
});
