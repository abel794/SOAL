const express = require('express');
const router = express.Router();

// Rutas existentes dinámicas
const rutasCoordinador = [
  'acudiente_coordinador',
  'asistencia_coordinador',
  'canal_notificacion_coordinador',
  'categoria_observacion_coordinador',
  'citas_coordinador',
  'configuracionSistemaRoutes',
  'epsRoutes',
  'estadoAcademicoRoutes',
  'estadoAsistenciaRoutes',
  'estadoNotificacionRoutes',
  'estadoPqrRoutes',
  'estadoUsuarioRoutes',
  'estudiantegradoRoutes',
  'estudianteRoutes',
  'funcionarioRoutes',
  'funcionarioGradoRoutes',
  'gradoRoutes',
  'grado_asistenciaRoutes',
  'gravedadObservacionRoutes',
  'historialObservacionRoutes',
  'justificacionRoutes',
  'nivelEscolaridadRoutes',
  'notificacionRoutes',
  'observacionesRoutes',
  'pqr_coordinador',    
  'personaRoutes',
  'registrarAcudienteRoutes',
  'registrarEstudianteRoute',
  'registrarFuncionarioRoutes',
  'relacionAcudienteRoutes',
  'sexoRoutes',
  'tipoDocumentoRoutes',
  'tipoPqrRoutes',
  'tipoUsuarioRoutes',
  'usuarioRoutes',
  'dashboardRoutes',
];

// Cargar rutas dinámicamente
rutasCoordinador.forEach((archivo) => {
  const ruta = require(`./${archivo}`);
  const base = `/${archivo.replace('Routes', '').replace('_coordinador', '')}`;
  router.use(base, ruta);
  console.log(`🔹 Ruta cargada: ${base} → ${archivo}`);
});

// 🔴 Ruta crítica de observaciones críticas
const observacionesCriticas = require('./observacionesCriticasRoutes');
// La dejamos explícita para no chocar con observacionesRoutes
router.use('/observaciones/criticas', observacionesCriticas);
//console.log('🔹 Ruta cargada: /observaciones/criticas → observacionesCriticasRoutes');

console.log('✅ Rutas del coordinador cargadas');

module.exports = router;
