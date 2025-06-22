const express = require('express');
const cors = require('cors');
const app = express();
const { sequelize } = require('./models'); // Para sincronizar la DB si se desea

// Middleware
app.use(cors());
app.use(express.json());

// Importar rutas
const estudianteRoutes = require('./routes/estudianteRoutes');
const citaRoutes = require('./routes/citaRoutes');
const observacionRoutes = require('./routes/observacionRoutes');
const profesorRoutes = require('./routes/profesorRoutes');
const asistenciaRoutes = require('./routes/asistenciaRoutes');
const categoriaObservacionRoutes = require('./routes/categoriaObservacionRoutes');
const acudienteRoutes = require('./routes/acudienteRoutes');
const estudiantegradoRoutes = require('./routes/estudiantegradoRoutes');
const secretariaRoutes = require('./routes/secretariaRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const gradoRoutes = require('./routes/gradoRoutes');
const historialObservacionRoutes = require('./routes/historialObservacionRoutes');
const profesorGradoRoutes = require('./routes/profesorGradoRoutes');

// Usar rutas
app.use('/api/estudiantes', estudianteRoutes);
app.use('/api/citas', citaRoutes);
app.use('/api/observaciones', observacionRoutes);
app.use('/api/profesores', profesorRoutes);
app.use('/api/asistencias', asistenciaRoutes);
app.use('/api/categorias', categoriaObservacionRoutes);
app.use('/api/acudientes', acudienteRoutes);
app.use('/api/estudiantegrados', estudiantegradoRoutes);
app.use('/api/secretarias', secretariaRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/grados', gradoRoutes);
app.use('/api/historial', historialObservacionRoutes);
app.use('/api/profesorgrados', profesorGradoRoutes);

// Puerto
const PORT = 3001;

// Iniciar servidor
app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida.');
  } catch (error) {
    console.error('❌ Error al conectar a la base de datos:', error);
  }

  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
