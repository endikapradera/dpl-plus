const url = 'http://localhost:8080/login';

function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // Enviar la solicitud de autenticación a tu API
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })
  .then(response => {
    // Verificar si la respuesta es un JSON
    if (response.headers.get('content-type')?.includes('application/json')) {
      return response.json();
    } else {
      return response.text(); // Si no es JSON, devolver el cuerpo de la respuesta como texto
    }
  })
  .then(data => {
    // Manejar el token directamente
    const accessToken = data.trim(); // Eliminar espacios en blanco

    if (accessToken) {
      // Autenticación exitosa, redirigir 
      alert('Inicio sesión exitoso!');
      
      // Almacenar el token en localStorage
      localStorage.setItem('token', accessToken);

      // Redirigir a la página de inicio
      window.location.href = '../mapa.html';
    } else {
      // Autenticación fallida, mostrar un mensaje de error
      alert('Datos incorrectos!');
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
}
