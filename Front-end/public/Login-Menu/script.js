// Función para mostrar el toast
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.innerText = message;
    toast.classList.add('show');

    // Ocultar el toast después de 3 segundos
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Escuchar el evento de envío del formulario de registro
document.getElementById('signup-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita el envío del formulario

    // Obtener los valores de los campos
    const name = event.target.elements[0].value; // Nombre
    const email = event.target.elements[1].value; // Email
    const password = event.target.elements[2].value; // Contraseña

    // Guardar en localStorage
    localStorage.setItem('userData', JSON.stringify({ name, email, password }));

    console.log('Datos de registro guardados:', { name, email, password }); // Mostrar en la consola
    showToast('Sign up successful!'); // Mostrar el toast de éxito
});

// Escuchar el evento de clic en el botón de "Log in"
document.getElementById('login-toggle').addEventListener('click', function() {
    const signupForm = document.getElementById('signup-form');
    const loginForm = document.getElementById('login-form');

    // Ocultar el formulario de registro
    signupForm.classList.remove('active');
    signupForm.classList.add('hidden');

    // Mostrar el formulario de inicio de sesión
    setTimeout(() => {
        loginForm.classList.add('active');
        loginForm.classList.remove('hidden');
    }, 500); // Tiempo de la animación
});

// Escuchar el evento de envío del formulario de inicio de sesión
document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita el envío del formulario

    // Obtener los valores de los campos
    const email = event.target.elements[0].value; // Email
    const password = event.target.elements[1].value; // Contraseña

    // Recuperar datos del localStorage
    const userData = JSON.parse(localStorage.getItem('userData'));

    // Verificar si los datos coinciden
    if (userData && userData.email === email && userData.password === password) {
        console.log('Inicio de sesión exitoso');
        showToast('Login successful!'); // Mostrar el toast de éxito
        // Aquí puedes redirigir al usuario o mostrar un mensaje de éxito
        setTimeout(() => {
            window.location.href = '../Navegation-bar/navegation.html'; // Cambia la ruta según sea necesario
        }, 3000); // Esperar 3 segundos antes de redirigir
    } else {
        console.log('Email o contraseña incorrectos');
        showToast('Email or password is incorrect.'); // Mostrar el toast de error
        // Aquí puedes mostrar un mensaje de error
    }
});

// Escuchar el evento de clic en el botón de "Sign up"
document.getElementById('signup-toggle').addEventListener('click', function() {
    const signupForm = document.getElementById('signup-form');
    const loginForm = document.getElementById('login-form');

    // Ocultar el formulario de inicio de sesión
    loginForm.classList.remove('active');
    loginForm.classList.add('hidden');

    // Mostrar el formulario de registro
    setTimeout(() => {
        signupForm.classList.add('active');
        signupForm.classList.remove('hidden');
    }, 500); // Tiempo de la animación
});

// script.js

// Escuchar el evento de envío del formulario de inicio de sesión
document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Previene el envío del formulario

    // Muestra el loader
    document.getElementById('loader').style.display = 'flex';

    // Simula un retraso para la carga (reemplaza esto con tu lógica de autenticación)
    setTimeout(function() {
        // Aquí iría la lógica para redirigir al usuario, por ejemplo:
        // window.location.href = 'pagina-siguiente.html';

        // Oculta el loader después de simular la carga
        document.getElementById('loader').style.display = 'none';
    }, 2000); // Simula 2 segundos de carga
});

// Escuchar el evento de envío del formulario de registro si es necesario
document.getElementById('signup-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Previene el envío del formulario

    // Puedes agregar una lógica similar para mostrar un loader para el registro
});

