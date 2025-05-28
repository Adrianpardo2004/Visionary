const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0'; // <-- IMPORTANTE para entornos Docker/Coolify

// Usa CORS
app.use(cors());
app.use(express.json()); // Permite recibir JSON en el backend

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, '..', 'Front-end', 'public')));
app.use(express.static(path.join(__dirname, '..', 'Front-end', 'public', 'Login-Menu')));
app.use(express.static(path.join(__dirname, '..', 'Front-end', 'public', 'DashBoard')));
app.use(express.static(path.join(__dirname, '..', 'Front-end', 'public', 'Views', 'Sales')));
app.use(express.static(path.join(__dirname, '..', 'Front-end', 'public', 'Views', 'About')));
app.use(express.static(path.join(__dirname, '..', 'Front-end', 'public', 'Views', 'Charts')));
app.use(express.static(path.join(__dirname, 'public', 'app.js')));

// Ruta para el index.html (login)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'Front-end', 'public', 'Login-Menu', 'index.html'));
});

// Ruta para descargar el archivo CSV
app.get('/download/csv', (req, res) => {
    const filePath = path.join(__dirname, '..', 'Back-end', 'FA_CAFAC_cod_pais_modificado.xlsx');
    res.download(filePath, 'FA_CAFAC_cod_pais_modificado.xlsx', (err) => {
        if (err) {
            console.error('Error al descargar el archivo:', err);
            res.status(500).send('Error al descargar el archivo');
        }
    });
});

// Iniciar el servidor
app.listen(PORT, HOST, () => {
    console.log(`Servidor en ejecución en http://${HOST}:${PORT}`);
});
