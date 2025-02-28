document.addEventListener("DOMContentLoaded", () => {
    const links = document.querySelectorAll('.nav a');
    const content = document.getElementById('content');

    let chartScriptLoaded = false;

    const loadPage = (page) => {
        fetch(`/views/${page}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al cargar la página: ' + response.statusText);
                }
                return response.text();
            })
            .then(html => {
                content.innerHTML = html; // Cargar HTML en el contenedor

                // Cargar el script solo si no se ha cargado antes
                if (page === 'dashboard.html' && !chartScriptLoaded) {
                    const script = document.createElement('script');
                    script.src = '/views/dashboard.js';
                    document.body.appendChild(script);
                    chartScriptLoaded = true; // Marca que el script ha sido cargado
                }
                if (page === 'chatbot/chat.html') {
                    initializeChatbot(); // Llamamos a la función para inicializar el chatbot
                }
            })
            .catch(error => console.error('Error al cargar el contenido:', error));
    };

    // Función para inicializar el chatbot
    const initializeChatbot = () => {
        const sendMessageButton = document.getElementById('sendMessage');
        const userMessageInput = document.getElementById('userMessage');
        const messagesContainer = document.getElementById('messages');

        sendMessageButton.addEventListener('click', () => {
            const userMessage = userMessageInput.value;
            if (!userMessage.trim()) return;

            // Mostrar el mensaje del usuario en la interfaz
            const userMessageElement = document.createElement('p');
            userMessageElement.textContent = `Tú: ${userMessage}`;
            messagesContainer.appendChild(userMessageElement);

            // Limpiar el campo de entrada
            userMessageInput.value = '';

            // Enviar el mensaje al servidor para obtener la respuesta del chatbot
            fetch('http://localhost:5000/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: userMessage })
            })
            .then(response => response.json())
            .then(data => {
                const chatbotMessageElement = document.createElement('p');
                chatbotMessageElement.textContent = `Chatbot: ${data.response}`;
                messagesContainer.appendChild(chatbotMessageElement);
            })
            .catch(error => {
                console.error('Error al obtener la respuesta del chatbot:', error);
            });
        });
    };

    // Cargar la sección inicial
    loadPage('Navegation-bar/navegation.html'); // Cargar la página inicial

    // Escuchar eventos de clic en los enlaces
    links.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); // Prevenir el comportamiento por defecto del enlace
            const page = link.getAttribute('data-section'); // Obtener el atributo data-section
            loadPage(page); // Cargar la página correspondiente
        });
    });
});
