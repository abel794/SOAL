// controllers/Profesor/index.js

const { obtenerEstudiantesPorProfesor } = require('../Profesor/estudiantesController');
const {
  registroMasivo,
  historialPorProfesor,
  historialPorEstudiante
} = require('./asistenciaController');

module.exports = {
  obtenerEstudiantesPorProfesor,
  registroMasivo,
  historialPorProfesor,
  historialPorEstudiante
};
