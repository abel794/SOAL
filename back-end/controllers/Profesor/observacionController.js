const db = require('../../models');
const Observacion = db.Observacion;
const Estudiante = db.Estudiante;
const Gravedad = db.GravedadObservacion;

const observacionController = {

  // 📌 1. Listar observaciones de los estudiantes asignados a este profesor
  async listar(req, res) {
    try {
      // 🔹 id_funcionario podría venir de la sesión o token
      const idProfesor = req.user?.id_funcionario || req.query.id_funcionario;

      if (!idProfesor) {
        return res.status(400).json({ error: 'Falta el id del profesor' });
      }

      const observaciones = await Observacion.findAll({
        include: [
          { model: Estudiante, as: 'estudiante' },
          { model: Gravedad, as: 'gravedad' }
        ],
        where: { id_funcionario: idProfesor }
      });

      res.json(observaciones);
    } catch (error) {
      console.error("Error al listar observaciones:", error);
      res.status(500).json({ error: 'Error al listar observaciones', detalle: error.message });
    }
  },

// 📌 2. Crear observación
async crear(req, res) {
  try {
    console.log("📥 BODY RECIBIDO:", req.body); // 👈 Para ver exactamente qué llega

    const { id_estudiante, id_gravedad, id_categoria, descripcion, fecha } = req.body;

    // Validar campos obligatorios
    if (!id_estudiante || !id_gravedad || !id_categoria || !descripcion) {
      return res.status(400).json({
        error: 'Faltan campos obligatorios',
        detalle: {
          id_estudiante,
          id_gravedad,
          id_categoria,
          descripcion,
          fecha
        }
      });
    }

    const nueva = await Observacion.create({
      id_estudiante,
      id_funcionario: req.user?.id_funcionario || 1,
      id_gravedad,
      id_categoria,
      descripcion,
      fecha: fecha || new Date()
    });

    res.status(201).json(nueva);
  } catch (error) {
    console.error("❌ Error al crear observación:", error);
    res.status(500).json({ error: 'Error al crear observación', detalle: error.message });
  }
},

  // 📌 3. Actualizar observación
  async actualizar(req, res) {
    try {
      const { id } = req.params;
      const [updated] = await Observacion.update(req.body, { where: { id_observacion: id } });

      if (!updated) {
        return res.status(404).json({ error: 'Observación no encontrada' });
      }

      res.json({ mensaje: 'Observación actualizada correctamente' });
    } catch (error) {
      console.error("Error al actualizar observación:", error);
      res.status(500).json({ error: 'Error al actualizar observación', detalle: error.message });
    }
  },

  // 📌 4. Eliminar observación
  async eliminar(req, res) {
    try {
      const { id } = req.params;
      const deleted = await Observacion.destroy({ where: { id_observacion: id } });

      if (!deleted) {
        return res.status(404).json({ error: 'Observación no encontrada' });
      }

      res.json({ mensaje: 'Observación eliminada correctamente' });
    } catch (error) {
      console.error("Error al eliminar observación:", error);
      res.status(500).json({ error: 'Error al eliminar observación', detalle: error.message });
    }
  }
};

module.exports = observacionController;
