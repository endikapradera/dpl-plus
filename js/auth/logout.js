function logout() {
  // Eliminar el token del localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('role');

  // Redireccionar a la página de inicio de sesión
  window.location.href = '../html/auth/options.html';
}