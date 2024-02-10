const url = 'http://localhost:8080/api/coches/all';
const registerUrl = 'http://localhost:8080/api/user/register';
const cocheSelect = document.getElementById('coche');
let coches = [];
// Realizar solicitud GET para obtener todos los modelos de coches
fetch(url)
  .then(response => response.json())
  .then(coches => {
    // 'coches' es un array de objetos, cada objeto representa un modelo de coche

    // Limpiar el select antes de agregar nuevas opciones
    cocheSelect.innerHTML = '';

    // Agregar opciones al select, excluyendo coches de empresas
    coches.forEach(coche => {
      if (coche.id !== 1 && coche.id !== 2) {
        const option = document.createElement('option');
        option.value = coche.id;
        option.text = `${coche.id}.- ${coche.marca} - ${coche.modelo} (${coche.largo} x  ${coche.ancho})`;
        cocheSelect.add(option);
      }
    });
  })
  .catch(error => console.error('Error al cargar los modelos de coches:', error));

// Función para realizar el registro
function register() {
 // Obtener los datos del formulario
 const name = document.getElementById('name').value;
 const lastname = document.getElementById('lastname').value;
 const email = document.getElementById('email').value;
 const password = document.getElementById('password').value;
 const cocheId = document.getElementById('coche').value;  // Aquí es donde se produce el error

 // Objeto con los datos del nuevo usuario
 const newUser = {
   nombre: name,
   apellido: lastname,
   email: email,
   password: password,
   coche: {
     id: cocheId
   }
 };

  // Realizar la solicitud POST al endpoint de registro
  fetch(registerUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newUser),
  })
    .then(response => response.text())
    .then(message => {
      // Mostrar un mensaje de éxito
      alert(message);

      window.location.href = 'login.html';
    })
    .catch(error => console.error('Error:', error));
}
