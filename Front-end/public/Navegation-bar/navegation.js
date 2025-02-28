// Función para cargar secciones dinámicamente en el contenedor #content
function loadPage(pageUrl) {
    fetch(pageUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al cargar la página: ${response.statusText}`);
            }
            return response.text();
        })
        .then(content => {
            const contentContainer = document.getElementById('content');
            contentContainer.innerHTML = content;

            // Cargar CSS y JS del archivo cargado
            loadAdditionalResources(pageUrl);

            // Inicializar el gráfico si es el dashboard
            if (pageUrl.includes('../DashBoard/dashboard.html')) {
                if (typeof loadSalesDataAndDrawChart === 'function') {
                    loadSalesDataAndDrawChart();
                } else {
                    console.error('La función loadSalesDataAndDrawChart no está definida.');
                }
            } else if (pageUrl.includes('../Views/Sales/sales.html')) {
                console.log("Sales page loaded");
            }
        })
        .catch(error => {
            console.error('Error al cargar el contenido:', error);
            alert('Error al cargar la página. Verifica la ruta o intenta nuevamente.');
        });
}

// Cargar CSS y JS adicionales solo si existen y tienen el tipo MIME correcto
function loadAdditionalResources(pageUrl) {
    // Comprobación y carga del archivo CSS
    const cssFile = pageUrl.replace('.html', '.css');
    fetch(cssFile, { method: 'HEAD' })
        .then(response => {
            if (response.ok && response.headers.get("Content-Type").includes("text/css")) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = cssFile;
                document.head.appendChild(link);
            } else {
                console.warn(`No se pudo cargar el archivo CSS: ${cssFile}`);
            }
        })
        .catch(error => console.error('Error al verificar el archivo CSS:', error));

    // Comprobación y carga del archivo JS
    const jsFile = pageUrl.replace('.html', '.js');
    fetch(jsFile, { method: 'HEAD' })
        .then(response => {
            if (response.ok && response.headers.get("Content-Type").includes("application/javascript")) {
                const script = document.createElement('script');
                script.src = jsFile;

                // Asegurar que el gráfico se cargue después del script
                script.onload = () => {
                    if (pageUrl.includes('dashboard.html') && typeof loadSalesDataAndDrawChart === 'function') {
                        loadSalesDataAndDrawChart();
                    }
                };

                document.body.appendChild(script);
            } else {
                console.warn(`No se pudo cargar el archivo JS: ${jsFile}`);
            }
        })
        .catch(error => console.error('Error al verificar el archivo JS:', error));
}

// Navegación y eventos en la barra de navegación
document.addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('.nav');

    window.addEventListener('scroll', function() {
        nav.classList.toggle('active', window.scrollY > 0);
    });

    // Verifica si la función existe antes de llamarla
    if (typeof loadSalesDataAndDrawChart === 'function') {
        loadSalesDataAndDrawChart();
    } else {
        console.error('La función loadSalesDataAndDrawChart no está definida.');
    }
});

// Configuración del menú de usuario
document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.getElementById("logoutButton");
    const dropdownButton = document.getElementById("dropdownButton");
    const dropdownContent = document.getElementById("dropdownContent");

    // Mostrar el menú desplegable al hacer clic en el botón ▼
    dropdownButton.addEventListener('click', (event) => {
        event.stopPropagation(); // Evitar que el clic se propague
        dropdownContent.classList.toggle('show');
    });

    // Ocultar el menú desplegable al hacer clic fuera del menú
    document.addEventListener('click', (event) => {
        if (!dropdownContent.contains(event.target) && !dropdownButton.contains(event.target)) {
            dropdownContent.classList.remove('show');
        }
    });

    // Acción para cerrar sesión
    logoutButton.addEventListener("click", (event) => {
        event.preventDefault(); // Evita la acción predeterminada del botón
        sessionStorage.removeItem("authenticated");

        // Reemplaza el estado actual en el historial del navegador
        history.replaceState(null, null, "../Login-Menu/index.html");

        // Redirecciona al login
        window.location.href = "../Login-Menu/index.html";
    });
});
