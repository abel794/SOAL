// 📦 Módulos principales
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./models');
const sequelize = db.sequelize;

// 🚀 Inicializa la app de Express
const app = express();


// ✅ Middlewares globales
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Carpeta para archivos subidos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Importación de rutas (organizadas por módulo)
const acudienteRoutes = require('./routes/acudienteRoutes');
const asistenciaRoutes = require('./routes/asistenciaRoutes');
const autenticacionRoutes = require('./routes/rutasAutenticacion');
const categoriaObservacionRoutes = require('./routes/categoriaObservacionRoutes');
const citaRoutes = require('./routes/citaRoutes');
const estudianteRoutes = require('./routes/estudianteRoutes');
const estudiantegradoRoutes = require('./routes/estudiantegradoRoutes');
const funcionarioRoutes = require('./routes/funcionarioRoutes');
const gradoRoutes = require('./routes/gradoRoutes');
const historialObservacionRoutes = require('./routes/historialObservacionRoutes');
const observacionRoutes = require('./routes/observacionRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const canalRoutes = require('./routes/canalRoutes');

const personaRoutes = require('./routes/personaRoutes');
const sexoRoutes = require('./routes/sexoRoutes');
const tipoDocumentoRoutes = require('./routes/tipoDocumentoRoutes');
const tipoPqrRoutes = require('./routes/tipoPqrRoutes');
const estadoPqrRoutes = require('./routes/estadoPqrRoutes');
const pqrRoutes = require('./routes/pqrRoutes');
const tipoUsuarioRoutes = require('./routes/tipoUsuarioRoutes');
const relacionAcudienteRoutes = require('./routes/relacionAcudienteRoutes');
const epsRoutes = require('./routes/epsRoutes');
const estadoAcademicoRoutes = require('./routes/estadoAcademicoRoutes');
const estadoAsistenciaRoutes = require('./routes/estadoAsistenciaRoutes');
const estadoNotificacionRoutes = require('./routes/estadoNotificacionRoutes');
const estadoUsuarioRoutes = require('./routes/estadoUsuarioRoutes');
const funcionarioGradoRoutes = require('./routes/funcionarioGradoRoutes');
const gravedadObservacionRoutes = require('./routes/gravedadObservacionRoutes');
const justificacionesRoutes = require('./routes/justuficacionRoutes');
const nivelEscolaridadRoutes = require('./routes/nivelEscolaridadRoutes');
const notificacionRoutes = require('./routes/notificacionRoutes');
const registroEstudianteRoutes = require('./routes/registrarEstudianteRoute');
const registroAcudienteRoutes = require('./routes/registrarAcudienteRoutes');
const registroFuncionarioRoutes = require('./routes/registrarFuncionarioRoutes');
const authRoutes = require('./routes/authRoutes');
const configuracionSistemaRoutes = require('./routes/configuracionSistemaRoutes');
app.use('/api/configuracion', configuracionSistemaRoutes);

// ✅ Montaje de rutas (usa los imports anteriores)
app.use('/api/acudientes', acudienteRoutes);
app.use('/api/asistencias', asistenciaRoutes);
app.use('/api/autenticacion', autenticacionRoutes);
app.use('/api/categorias', categoriaObservacionRoutes);
app.use('/api/citas', citaRoutes);
app.use('/api/estudiantes', estudianteRoutes);
app.use('/api/estudiantegrados', estudiantegradoRoutes);
app.use('/api/funcionarios', funcionarioRoutes);
app.use('/api/grados', gradoRoutes);
app.use('/api/historial', historialObservacionRoutes);
app.use('/api/observacion', observacionRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/canales', canalRoutes);

app.use('/api/personas', personaRoutes);
app.use('/api/sexos', sexoRoutes);
app.use('/api/tipo-documento', tipoDocumentoRoutes);
app.use('/api/tipo-pqr', tipoPqrRoutes);
app.use('/api/estado-pqr', estadoPqrRoutes);
app.use('/api/pqrs', pqrRoutes);
app.use('/api/tipo-usuario', tipoUsuarioRoutes);
app.use('/api/relaciones', relacionAcudienteRoutes);
app.use('/api/eps', epsRoutes);
app.use('/api/estadoAcademico', estadoAcademicoRoutes);
app.use('/api/estadoAsistencia', estadoAsistenciaRoutes);
app.use('/api/estadoNotificacion', estadoNotificacionRoutes);
app.use('/api/estado-usuario', estadoUsuarioRoutes);
app.use('/api/funcionariogrados', funcionarioGradoRoutes);
app.use('/api/gravedades', gravedadObservacionRoutes);
app.use('/api/justificaciones', justificacionesRoutes);
app.use('/api/nivel-escolaridad', nivelEscolaridadRoutes);
app.use('/api/notificacion', notificacionRoutes);
app.use('/api/observaciones', observacionRoutes);
app.use('/api/registro-estudiante', registroEstudianteRoutes);
app.use('/api/registro-acudiente', registroAcudienteRoutes);
app.use('/api/registro-funcionario', registroFuncionarioRoutes);
app.use('/api/auth', authRoutes);

// ✅ Puerto del servidor
const PORT = process.env.PORT || 3000;

// ✅ Conexión Sequelize + Inicio del servidor
sequelize.authenticate()
  .then(() => {
    console.log('✅ Conexión a la base de datos establecida.');
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch(error => {
    console.error('❌ Error al conectar a la base de datos:', error);
  });
