const db = require('../models');
const Estudiantegrado = db.Estudiantegrado;
const Estudiante = db.Estudiante;
const Grado = db.Grado;

const estudiantegradoController = {
  // ✅ Asignar estudiante a un grado
  async asignar(req, res) {
    const { id_estudiante, id_grado } = req.body;

    try {
      const asignacion = await Estudiantegrado.create({ id_estudiante, id_grado });
      res.status(201).json({ mensaje: 'Estudiante asignado al grado', asignacion });
    } catch (error) {
      res.status(400).json({ error: 'Error al asignar estudiante al grado', detalle: error.message });
    }
  },

  // ✅ Obtener todos los grados de un estudiante
  async gradosDeEstudiante(req, res) {
    const { id_estudiante } = req.params;
    try {
      const grados = await Estudiantegrado.findAll({
        where: { id_estudiante },
        include: { model: Grado }
      });
      res.json(grados);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener grados del estudiante' });
    }
  },

  // ✅ Obtener todos los estudiantes de un grado
  async estudiantesDeGrado(req, res) {
    const { id_grado } = req.params;
    try {
      const estudiantes = await Estudiantegrado.findAll({
        where: { id_grado },
        include: { model: Estudiante }
      });
      res.json(estudiantes);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener estudiantes del grado' });
    }
  },
  // Contar estudiantes por grado
async contarPorGrado(req, res) {
      const nombreGrado = req.params.nombre;
      try {
        const grado = await Grado.findOne({ where: { nombre_grado: nombreGrado } });
        if (!grado) return res.status(404).json({ error: 'Grado no encontrado' });

        const total = await Estudiantegrado.count({
          where: { id_grado: grado.id_grado }
        });

        res.json({ total_estudiantes: total });
      } catch (error) {
        console.error('Error al contar estudiantes por grado:', error);
        res.status(500).json({ error: 'Error al contar estudiantes por grado' });
      }
    },

  // ✅ Eliminar asignación
  // ✅ Eliminar asignación
async eliminar(req, res) {
  const { id_estudiante, id_grado } = req.params;

  try {
    const eliminado = await Estudiantegrado.destroy({
      where: {
        id_estudiante,
        id_grado
      }
    });

    if (eliminado === 0) {
      return res.status(404).json({ mensaje: 'Asignación no encontrada' });
    }

    res.json({ mensaje: 'Asignación eliminada correctamente' });
  } catch (error) {
    console.error('❌ Error al eliminar asignación:', error);
    res.status(500).json({ error: 'Error interno al eliminar asignación' });
  }
},



  // ✅ Listar todas las asignaciones
  async listar(req, res) {
    try {
      const lista = await Estudiantegrado.findAll({
        include: [Estudiante, Grado]
      });
      res.json(lista);
    } catch (error) {
      res.status(500).json({ error: 'Error al listar asignaciones' });
    }
  }
};

module.exports = estudiantegradoController;
