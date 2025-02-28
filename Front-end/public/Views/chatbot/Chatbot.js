import React, { useState } from 'react';
import axios from 'axios';

const Chatbot = () => {
    // Estados para el mensaje del usuario y la respuesta del chatbot
    const [userMessage, setUserMessage] = useState('');
    const [chatbotResponse, setChatbotResponse] = useState('');
    const [loading, setLoading] = useState(false);

    // Maneja el envío de mensajes
    const sendMessage = async () => {
        if (!userMessage.trim()) return;

        setLoading(true);

        try {
            // Enviamos el mensaje al backend (servidor Express)
            const response = await axios.post('http://localhost:5000/chat', { message: userMessage });
            setChatbotResponse(response.data.response); // Muestra la respuesta del chatbot
        } catch (error) {
            console.error("Error al obtener respuesta del chatbot:", error);
            setChatbotResponse("Hubo un error al comunicarse con el chatbot.");
        }

        setLoading(false);
        setUserMessage(''); // Limpiar el campo de texto
    };

    return (
        <div className="chat-container">
            <h2>Chatbot</h2>
            <div className="chatbox">
                <div className="messages">
                    <div className="user-message">
                        {userMessage && <p><strong>Tú:</strong> {userMessage}</p>}
                    </div>
                    <div className="chatbot-message">
                        {chatbotResponse && <p><strong>Chatbot:</strong> {chatbotResponse}</p>}
                    </div>
                </div>
                <div className="input-box">
                    <input
                        type="text"
                        value={userMessage}
                        onChange={(e) => setUserMessage(e.target.value)}
                        placeholder="Escribe tu mensaje..."
                    />
                    <button onClick={sendMessage} disabled={loading}>
                        {loading ? 'Cargando...' : 'Enviar'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chatbot;
