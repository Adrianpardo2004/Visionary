const express = require('express');
const cors = require('cors');
const path = require('path');
const { OpenAI } = require('openai');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Usa CORS
app.use(cors());
app.use(express.json()); // Permite recibir JSON en el backend

// Middleware para servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, '..', 'Front-end', 'public')));
app.use(express.static(path.join(__dirname, '..', 'Front-end', 'public', 'Login-Menu')));
app.use(express.static(path.join(__dirname, '..', 'Front-end', 'public', 'DashBoard')));
app.use(express.static(path.join(__dirname, '..', 'Front-end', 'public', 'Views', 'Sales')));
app.use(express.static(path.join(__dirname, '..', 'Front-end', 'public', 'Views', 'About')));
app.use(express.static(path.join(__dirname, '..', 'Front-end', 'public', 'Views', 'Charts')));
app.use(express.static(path.join(__dirname, 'public', 'app.js')));

// Ruta para el index.html (login) desde la carpeta SING_UP
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'Front-end', 'public', 'Login-Menu', 'index.html'));
});

// Ruta para descargar el archivo CSV
app.get('/download/csv', (req, res) => {
    const filePath = path.join(__dirname, '..', 'Back-end', 'FA_CAFAC_cod_pais_modificado.xlsx'); // Asegúrate de que esta ruta sea correcta
    res.download(filePath, 'FA_CAFAC_cod_pais_modificado.xlsx', (err) => {
        if (err) {
            console.error('Error al descargar el archivo:', err);
            res.status(500).send('Error al descargar el archivo');
        }
    });
});

// Configurar OpenAI con la clave API
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Ruta para el chatbot
app.post('/chat', async (req, res) => {
    const { message } = req.body;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                { role: "system", content: "Eres un asistente útil." },
                { role: "user", content: message }
            ]
        });

        res.json({ response: response.choices[0].message.content });
    } catch (error) {
        console.error("Error al conectar con OpenAI:", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});
