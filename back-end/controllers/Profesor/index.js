const { obtenerEstudiantesAsignados } = require('../Profesor/estudiantesController');
const {
  registroMasivo,
  historialPorProfesor,
  historialPorEstudiante
} = require('./asistenciaController');



module.exports = {
  obtenerEstudiantesAsignados,
  registroMasivo,
  historialPorProfesor,
  historialPorEstudiante
};
