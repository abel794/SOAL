const { obtenerEstudiantesAsignados, obtenerGradosPorProfesor } = require('./estudiantesController');
const { registrarMasivo, obtenerTodas, obtenerConFiltros } = require('./asistenciaController');

module.exports = {
  obtenerEstudiantesAsignados,
  obtenerGradosPorProfesor,
  registrarMasivo,
  obtenerTodas,
  obtenerConFiltros
};
