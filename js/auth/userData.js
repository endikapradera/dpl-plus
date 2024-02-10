document.addEventListener('DOMContentLoaded', function () {
  // Verificar la autenticación
  const token = localStorage.getItem('token');

  if (!token) {
    window.location.href = '../html/auth/options.html';
  } else {
 
    
    // URL del endpoint para obtener los datos del usuario por email
    const url = 'http://localhost:8080/api/user/email';
    const url2 = 'http://localhost:8080/api/user/all';
    const parkingsUrl = 'http://localhost:8080/api/parking/all';


    // Fetch para obtener los datos del usuario por email
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(response => response.json())
      .then(userData => {
        // guardamos el el role en local storage
        localStorage.setItem('role', userData.roles[0].nombre);

        // Actualizar los elementos HTML con los detalles del usuario
        document.getElementById('user-id').textContent = userData.id;
        document.getElementById('user-name').textContent = userData.nombre;
        document.getElementById('user-lastname').textContent = userData.apellido;
        document.getElementById('user-email').textContent = userData.email;
        document.getElementById('user-role').textContent = userData.roles[0].nombre;

        // Obtenemos datos del coche
        document.getElementById('user-coche-id').textContent = userData.coche.id;
        document.getElementById('user-coche-marca').textContent = userData.coche.marca;
        document.getElementById('user-coche-modelo').textContent = userData.coche.modelo;
        document.getElementById('user-coche-longitud').textContent = `${userData.coche.largo} metros`;
        document.getElementById('user-coche-ancho').textContent = `${userData.coche.ancho} metros`;
      })
      .catch(error => console.error('Error:', error));



    // Fetch para obtener todos los usuarios
    fetch(url2, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(response => response.json())
      .then(users => {

        // Limpiar la tabla antes de agregar nuevos elementos
        const usersTable = document.getElementById('usersTable');
        usersTable.innerHTML = '';

        // Iterar sobre la lista de usuarios y agregarlos a la tabla HTML
        users.forEach(user => {
          const userRow = document.createElement('tr');

          const userIdCell = document.createElement('td');
          userIdCell.textContent = user.id;
          userRow.appendChild(userIdCell);

          const userNameCell = document.createElement('td');
          userNameCell.textContent = user.nombre;
          userRow.appendChild(userNameCell);

          const userLastNameCell = document.createElement('td');
          userLastNameCell.textContent = user.apellido;
          userRow.appendChild(userLastNameCell);

          const userEmailCell = document.createElement('td');
          userEmailCell.textContent = user.email;
          userRow.appendChild(userEmailCell);

          const userRoleCell = document.createElement('td');
          userRoleCell.textContent = user.roles[0].nombre; // Ajusta esto según tu estructura de roles
          userRow.appendChild(userRoleCell);

          const userActionsCell = document.createElement('td');
          const deleteButton = document.createElement('button');
          deleteButton.className = 'btn btn-danger';
          deleteButton.textContent = 'Eliminar';
          deleteButton.onclick = () => {
            // Realizar solicitud DELETE al endpoint de eliminación de usuario
            fetch(`http://localhost:8080/api/user/delete/${user.id}`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
            })
              .then(response => response.text())
              .then(message => {
                // Mostrar un mensaje de éxito
                alert(message);
                // Recargar la página para mostrar la lista actualizada
                window.location.reload();
              })
              .catch(error => console.error('Error:', error));
          };
          userActionsCell.appendChild(deleteButton);

          userRow.appendChild(userActionsCell);

          usersTable.appendChild(userRow);
        });
      })
      .catch(error => console.error('Error:', error));

    /*OBTENER PARKINGS */
    // Obtener referencia a la tbody de la tabla
    var tbody = document.getElementById('parkingTable');

    // Realizar la solicitud fetch
    fetch(parkingsUrl, {
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
          var eliminarCell = row.insertCell(5);

          idCell.textContent = parking.parkingId;
          nombreCell.textContent = parking.nombre;
          plazasTotalesCell.textContent = parking.plazasTotales;
          precioMinutoCell.textContent = parking.precioMinuto;
          plazasDispo.textContent = parking.plazasDisponibles;

          // Botón eliminar
          var eliminarButton = document.createElement('button');
          eliminarButton.className = 'btn btn-danger';
          eliminarButton.textContent = 'Eliminar';
          eliminarButton.onclick = function () {
            eliminarParking(parking.parkingId);
          };

          eliminarCell.appendChild(eliminarButton);
        });
      })
      .catch(error => {
        console.error('Error al cargar datos de parkings', error);
      });

    // Función para eliminar un parking
    function eliminarParking(parkingId) {
      // Realizar la solicitud DELETE al endpoint de eliminación de parking
      fetch(`http://localhost:8080/api/parking/${parkingId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then(response => response.text())
        .then(message => {
          // Mostrar un mensaje de éxito
          alert("Exito " + message);
          // Recargar la página para mostrar la lista actualizada
          window.location.reload();
        })
        .catch(error => console.error('Error:', error));
    }
    const role = localStorage.getItem('role'); // Asegúrate de guardar el nombre del rol en 'userRole'

    if (role.trim() === 'ROLE_ADMIN') {
      document.getElementById('usuarios').style.display = 'block';
      document.getElementById('parking').style.display = 'none';
    } 
    if (role.trim() === 'ROLE_MANAGER') {
      document.getElementById('parking').style.display = 'block';
      document.getElementById('usuarios').style.display = 'none';
    }
    if(role.trim() === 'ROLE_USER'){
      document.getElementById('parking').style.display = 'none';
      document.getElementById('usuarios').style.display = 'none';
    }
  }
});
