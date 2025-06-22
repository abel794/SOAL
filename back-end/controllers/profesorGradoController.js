const db = require('../models');
const ProfesorGrado = db.ProfesorGrado;
const Profesor = db.Profesor;
const Grado = db.Grado;

const profesorGradoController = {
  // ✅ Asignar un grado a un profesor
  async asignar(req, res) {
    try {
      const nuevaAsignacion = await ProfesorGrado.create(req.body);
      res.status(201).json({ mensaje: 'Grado asignado al profesor', data: nuevaAsignacion });
    } catch (error) {
      res.status(400).json({ error: 'Error al asignar grado', detalle: error.message });
    }
  },

  // ✅ Obtener todos los grados de un profesor
  async gradosPorProfesor(req, res) {
    const id_profesor = req.params.id;
    try {
      const grados = await ProfesorGrado.findAll({
        where: { id_profesor },
        include: {
          model: Grado,
          attributes: ['id_grado', 'nombre_grado', 'descripcion']
        }
      });

      res.json(grados);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener grados del profesor' });
    }
  },

  // ✅ Obtener todos los profesores de un grado
  async profesoresPorGrado(req, res) {
    const id_grado = req.params.id;
    try {
      const profesores = await ProfesorGrado.findAll({
        where: { id_grado },
        include: {
          model: Profesor,
          attributes: ['id_profesor', 'nombre', 'apellido', 'especialidad']
        }
      });

      res.json(profesores);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener profesores del grado' });
    }
  },

  // ✅ Eliminar una asignación específica
  async eliminarAsignacion(req, res) {
    const { id_profesor, id_grado } = req.params;
    try {
      const eliminado = await ProfesorGrado.destroy({
        where: { id_profesor, id_grado }
      });

      if (eliminado === 0) {
        res.status(404).json({ error: 'Asignación no encontrada' });
      } else {
        res.json({ mensaje: 'Asignación eliminada correctamente' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar la asignación' });
    }
  },

  // ✅ Obtener todas las asignaciones
  async obtenerTodas(req, res) {
    try {
      const asignaciones = await ProfesorGrado.findAll({
        include: [Profesor, Grado]
      });
      res.json(asignaciones);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener asignaciones' });
    }
  }
};

module.exports = profesorGradoController;
