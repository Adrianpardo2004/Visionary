const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

// Middleware
app.use(cors());
app.use(express.json());

// Ruta absoluta a los archivos estáticos
const publicPath = path.join(__dirname, '..', 'Front-end', 'public');
app.use(express.static(publicPath));

// Ruta al index.html dentro de Login-Menu
app.get('/', (req, res) => {
  res.sendFile(path.join(publicPath, 'Login-Menu', 'index.html'));
});

// Cualquier otra ruta (opcional, para SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'Login-Menu', 'index.html'));
});

app.listen(PORT, HOST, () => {
  console.log(`Servidor en ejecución en http://${HOST}:${PORT}`);
});
