const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Rutas
const observacionesRoutes = require('./routes/observaciones');
const estudianteRoutes = require('./routes/estudianteRoutes');
const citaRoutes = require('./routes/citaRoutes');

app.use('/api/observaciones', observacionesRoutes);
app.use('/api/estudiantes', estudianteRoutes);
app.use('/api/citas', citaRoutes);

// Ruta de prueba
app.get('/api/saludo', (req, res) => {
  res.json({ mensaje: 'Hola desde el servidor' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
