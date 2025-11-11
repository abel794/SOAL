const { Sequelize } = require('sequelize');
const db = require('../../models');
const RelacionAcudiente = db.RelacionAcudiente;
const Acudiente = db.Acudiente;

const relacionAcudienteController = {

  // 🔍 Obtener todas las relaciones (para dropdowns o listados)
  async obtenerTodas(req, res) {
    try {
      const relaciones = await RelacionAcudiente.findAll();
      return res.json(relaciones);
    } catch (error) {
      console.error('Error al obtener relaciones:', error);
      return res.status(500).json({ error: 'Error al obtener las relaciones' });
    }
  },

  // 🔍 Obtener una relación por su ID
  async obtenerPorId(req, res) {
    const id = req.params.id;
    try {
      const relacion = await RelacionAcudiente.findByPk(id);
      if (!relacion) {
        return res.status(404).json({ error: 'Relación no encontrada' });
      }
      return res.json(relacion);
    } catch (error) {
      console.error('Error al buscar la relación:', error);
      return res.status(500).json({ error: 'Error al buscar la relación' });
    }
  },

  // 🆕 Crear una nueva relación
  async crear(req, res) {
    try {
      const nuevaRelacion = await RelacionAcudiente.create(req.body);
      return res.status(201).json(nuevaRelacion);
    } catch (error) {
      console.error('Error al crear relación:', error);
      return res.status(400).json({ error: 'Error al crear la relación', detalle: error.message });
    }
  },

  // ✏️ Actualizar una relación existente
  async actualizar(req, res) {
    const id = req.params.id;
    try {
      const [filasActualizadas] = await RelacionAcudiente.update(req.body, {
        where: { id_relacion: id }
      });
      if (filasActualizadas === 0) {
        return res.status(404).json({ error: 'Relación no encontrada o sin cambios' });
      }
      return res.json({ mensaje: 'Relación actualizada correctamente' });
    } catch (error) {
      console.error('Error al actualizar relación:', error);
      return res.status(400).json({ error: 'Error al actualizar relación', detalle: error.message });
    }
  },

  // ❌ Eliminar una relación
  async eliminar(req, res) {
    const id = req.params.id;
    try {
      const filasEliminadas = await RelacionAcudiente.destroy({
        where: { id_relacion: id }
      });
      if (filasEliminadas === 0) {
        return res.status(404).json({ error: 'Relación no encontrada' });
      }
      return res.json({ mensaje: 'Relación eliminada correctamente' });
    } catch (error) {
      console.error('Error al eliminar relación:', error);
      return res.status(500).json({ error: 'Error al eliminar relación' });
    }
  },

  // 📊 Contar cuántos acudientes hay por cada tipo de relación
  async contarAcudientesPorRelacion(req, res) {
  try {
    const relaciones = await RelacionAcudiente.findAll({
      include: [{
        model: Acudiente,
        as: 'acudientes',
        attributes: []
      }],
      attributes: [
        'nombre',
        [Sequelize.fn('COUNT', Sequelize.col('acudientes.id_acudiente')), 'cantidad']
      ],
      group: ['RelacionAcudiente.id_relacion']
    });
    return res.json(relaciones);
  } catch (error) {
    console.error('Error al contar acudientes por relación:', error);
    return res.status(500).json({ error: 'Error al contar acudientes por relación' });
  }
}


};

module.exports = relacionAcudienteController;
