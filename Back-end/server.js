const express = require('express');
const cors = require('cors');
const path = require('path');
const { OpenAI } = require('openai');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = 3000; // Fuerza el uso del puerto 3000

// Middleware
app.use(cors());
app.use(express.json());

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, '..', 'Front-end', 'public')));

// Ruta principal que sirve el archivo de login
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'Front-end', 'public', 'Login-Menu', 'index.html'));
});

// Ruta para descargar el archivo Excel
app.get('/download/csv', (req, res) => {
    const filePath = path.join(__dirname, '..', 'Back-end', 'FA_CAFAC_cod_pais_modificado.xlsx');
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
            model: 'gpt-4',
            messages: [
                { role: 'system', content: 'Eres un asistente útil.' },
                { role: 'user', content: message }
            ]
        });

        res.json({ response: response.choices[0].message.content });
    } catch (error) {
        console.error('Error al conectar con OpenAI:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Middleware de manejo de errores generales
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('¡Algo salió mal en el servidor!');
});

// Iniciar el servidor en el puerto 3000
app.listen(PORT, () => {
    console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});
