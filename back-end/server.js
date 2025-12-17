// server.js (reemplaza TODO con esto)
require('dotenv').config();

// Captura global de errores *antes de todo*
process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 UNHANDLED REJECTION:', reason);
});
process.on('uncaughtException', (error) => {
  console.error('💥 UNCAUGHT EXCEPTION:', error);
});

console.log('🟢 server.js empezó a ejecutarse');
console.log('🌱 PORT:', process.env.PORT || 3000);
console.log('🌱 DB_NAME:', process.env.DB_NAME);

const listEndpoints = require('express-list-endpoints');
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./models');
const sequelize = db.sequelize;

const app = express();

// Middlewares básicos (logger ARRIBA)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.url}`);
  next();
});

// CORS seguro: NUNCA lanzar Error desde el callback
const allowedOrigins = [
  "https://soal-sistema-de-observador-para-el-alumnovercel-jfivs1yti.vercel.app",
  "https://soal-ten.vercel.app",
  "http://localhost:5173",
  "http://localhost:3001",
  "http://localhost:3000"
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // Postman / requests sin origin
    if (allowedOrigins.includes(origin)) return callback(null, true);
    console.warn('⛔ CORS bloqueado:', origin);
    return callback(null, false); // *nunca* callback(new Error(...))
  },
  credentials: true,
}));

// Health & Ping
app.get('/health', async (req, res) => {
  try {
    await sequelize.authenticate();
    return res.json({ status: 'OK' });
  } catch (err) {
    console.error('Health check DB error:', err);
    return res.status(500).json({ status: 'DB_DOWN' });
  }
});
app.get('/api/ping', (req, res) => res.json({ ok: true, time: Date.now() }));

// Carpeta pública
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rutas (asegúrate que cada ruta solo se registre UNA vez)
const obtenerArchivo = require('./routes/coordinador/obtenerArchivo');
app.use('/api', obtenerArchivo);

app.use("/api/email", require("./routes/emailRouter"));
app.use('/api/autenticacion', require('./routes/rutasAutenticacion'));
app.use('/api/usuarios', require('./routes/coordinador/usuarioRoutes'));
app.use('/api/usuario', require('./routes/usuarioHashTemporalRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/asistencias', require('./routes/coordinador/asistencia_coordinador'));
app.use('/api/categorias', require('./routes/coordinador/categoria_observacion_coordinador'));
app.use('/api/citas', require('./routes/coordinador/citas_coordinador'));
app.use('/api/eps', require('./routes/coordinador/epsRoutes'));
app.use('/api/configuracionUsuario', require('./routes/configuracionUsuario'));

app.use('/api/estudiantes/observaciones', require('./routes/citas_estudiante/observacionesEstudianteRoutes'));
app.use('/api/estudiantes/citas', require('./routes/citas_estudiante/citas_estudiante'));

app.use('/api/acudientes/informacion', require('./routes/acudiente/informacionEstudianteRoutes'));
app.use('/api/acudientes/observaciones', require('./routes/acudiente/observacionesAcudienteRoutes'));
app.use('/api/acudientes/citas', require('./routes/acudiente/citas_acudiente'));
app.use('/api/acudientes/pqr', require('./routes/acudiente/pqr_acudiente'));

app.use('/api/notificaciones', require('./routes/acudiente/notificacionesAcudiente'));
app.use('/api/notificaciones/estudiantes', require('./routes/citas_estudiante/notificacionesEstudiante'));

app.use('/api', require('./routes/coordinador/observacionesCriticasRoutes'));

app.use('/api/notificaciones-secretaria', require('./routes/notificacionesSecretariaRoutes'));
app.use('/api/dashboard-secretaria', require('./routes/dashboardSecretariaRoutes'));

app.use('/api/coordinador', require('./routes/coordinador'));

// PROFESOR: registra UNA sola vez
app.use('/api/profesor', require('./routes/profesor/profesorRoutes'));

// Raíz
app.get('/', (req, res) => {
  res.send('✅ Backend activo y corriendo');
});

// Middleware de errores (último)
app.use((err, req, res, next) => {
  console.error('🔴 ERROR GLOBAL:', err);
  res.status(500).json({ error: err.message, stack: process.env.NODE_ENV === 'production' ? undefined : err.stack });
});

// Arranque
const PORT = process.env.PORT || 3002;
sequelize.authenticate()
  .then(() => {
    console.log('✅ Conexión a la base de datos establecida.');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      // console.table(listEndpoints(app)); // descomenta si quieres ver endpoints
    });
  })
  .catch(error => {
    console.error('❌ Error al conectar a la base de datos:', error);
    process.exit(1);
  });
