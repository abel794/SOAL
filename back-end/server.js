// 📂 back-end/server.js
require('dotenv').config();
const listEndpoints = require('express-list-endpoints');
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./models');
const sequelize = db.sequelize;

const app = express();

// 🌐 Middlewares globales CORS
const allowedOrigins = [
  "https://soal-sistema-de-observador-para-el-alumnovercel-jfivs1yti.vercel.app",
  "https://soal-ten.vercel.app",
  "http://localhost:5173",
  "http://localhost:3001"
];


app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // Postman o requests sin origin
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error(`CORS no permitido para: ${origin}`), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🩵 Ping para verificar conexión rápida
app.get('/api/ping', (req, res) => res.json({ ok: true, time: Date.now() }));

// 🗂️ Carpeta pública para archivos subidos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 🧱 Rutas personalizadas de archivos
const obtenerArchivo = require('./routes/coordinador/obtenerArchivo');
app.use('/api', obtenerArchivo);

// Rutas generales
app.use("/api/email", require("./routes/emailRouter"));
app.use('/api/autenticacion', require('./routes/rutasAutenticacion'));
app.use('/api/usuarios', require('./routes/coordinador/usuarioRoutes'));
app.use('/api/usuario', require('./routes/usuarioHashTemporalRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/asistencias', require('./routes/coordinador/asistencia_coordinador'));
app.use('/api/categorias', require('./routes/coordinador/categoria_observacion_coordinador'));
app.use('/api/citas', require('./routes/coordinador/citas_coordinador'));
app.use('/api/eps', require('./routes/coordinador/epsRoutes'));
app.use('/api/profesor', require('./routes/profesor/profesorRoutes'));
app.use('/api/configuracionUsuario', require('./routes/configuracionUsuario'));

// Rutas de ESTUDIANTE
app.use('/api/estudiantes/observaciones', require('./routes/citas_estudiante/observacionesEstudianteRoutes'));
app.use('/api/estudiantes/citas', require('./routes/citas_estudiante/citas_estudiante'));

// Rutas de ACUDIENTE
app.use('/api/acudientes/informacion', require('./routes/acudiente/informacionEstudianteRoutes'));
app.use('/api/acudientes/observaciones', require('./routes/acudiente/observacionesAcudienteRoutes'));
app.use('/api/acudientes/citas', require('./routes/acudiente/citas_acudiente'));
app.use('/api/acudientes/pqr', require('./routes/acudiente/pqr_acudiente'));

// Rutas de NOTIFICACIONES
app.use('/api/notificaciones', require('./routes/acudiente/notificacionesAcudiente'));
app.use('/api/notificaciones/estudiantes', require('./routes/citas_estudiante/notificacionesEstudiante'));

// OBSERVACIONES CRÍTICAS (sin auth)
app.use('/api', require('./routes/coordinador/observacionesCriticasRoutes'));

// Rutas de SECRETARÍA
app.use('/api/notificaciones-secretaria', require('./routes/notificacionesSecretariaRoutes'));
app.use('/api/dashboard-secretaria', require('./routes/dashboardSecretariaRoutes'));

// Rutas de COORDINADOR
app.use('/api/coordinador', require('./routes/coordinador'));

// Rutas de PROFESOR
app.use('/api/profesor', require('./routes/profesor/profesorRoutes'));

// 🧾 Middleware de logging
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

app.get('/', (req, res) => {
  res.send('✅ Backend activo y corriendo en Render!');
});

// Middleware de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

// ✅ Puerto
const PORT = process.env.PORT || 3000;

// Conexión a la base de datos y arranque del servidor
sequelize.authenticate()
  .then(() => {
    console.log('✅ Conexión a la base de datos establecida.');
    app.listen(PORT,'0.0.0.0', () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      // console.table(listEndpoints(app)); // Descomenta si quieres ver todas las rutas
    });
  })
  .catch(error => {
    console.error('❌ Error al conectar a la base de datos:', error);
  });
