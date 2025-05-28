const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0'; // Para producción o Docker

// Middleware
app.use(cors());
app.use(express.json());

// Servir archivos estáticos desde Front-end/public
app.use(express.static(path.join(__dirname, '..', 'Front-end', 'public')));

// Ruta principal: Login
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'Front-end', 'public', 'Login-Menu', 'index.html'));
});

// Rutas específicas para otras vistas
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'Front-end', 'public', 'DashBoard', 'dashboard.html'));
});

app.get('/sales', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'Front-end', 'public', 'Views', 'Sales', 'sales.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'Front-end', 'public', 'Views', 'About', 'about.html'));
});

app.get('/charts', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'Front-end', 'public', 'Views', 'Charts', 'charts.html'));
});

// Ruta para descargar el archivo CSV (en realidad es un .xlsx)
app.get('/download/csv', (req, res) => {
    const filePath = path.join(__dirname, '..', 'Back-end', 'FA_CAFAC_cod_pais_modificado.xlsx');
    res.download(filePath, 'FA_CAFAC_cod_pais_modificado.xlsx', (err) => {
        if (err) {
            console.error('Error al descargar el archivo:', err);
            res.status(500).send('Error al descargar el archivo');
        }
    });
});

// Iniciar servidor
app.listen(PORT, HOST, () => {
    console.log(`Servidor en ejecución en http://${HOST}:${PORT}`);
});
