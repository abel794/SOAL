const db = require('../models');
const RelacionAcudiente = db.RelacionAcudiente;
const Acudiente = db.Acudiente;

const relacionAcudienteController = {

  // 🔍 Obtener todas las relaciones (útil para mostrar en dropdowns)
  async obtenerTodas(req, res) {
    try {
      const relaciones = await RelacionAcudiente.findAll();
      res.json(relaciones);
    } catch (error) {
      console.error('Error al obtener relaciones:', error);
      res.status(500).json({ error: 'Error al obtener las relaciones' });
    }
  },

  // 🔍 Obtener una relación por ID
  async obtenerPorId(req, res) {
    try {
      const id = req.params.id;
      const relacion = await RelacionAcudiente.findByPk(id);

      if (!relacion) {
        return res.status(404).json({ error: 'Relación no encontrada' });
      }

      res.json(relacion);
    } catch (error) {
      res.status(500).json({ error: 'Error al buscar la relación' });
    }
  },

  // 🆕 Crear una nueva relación
  async crear(req, res) {
    try {
      const nueva = await RelacionAcudiente.create(req.body);
      res.status(201).json(nueva);
    } catch (error) {
      console.error('Error al crear relación:', error);
      res.status(400).json({ error: 'Error al crear la relación', detalle: error.message });
    }
  },

  // ✏️ Actualizar relación existente
  async actualizar(req, res) {
    const id = req.params.id;

    try {
      const [actualizado] = await RelacionAcudiente.update(req.body, {
        where: { id_relacion: id }
      });

      if (actualizado === 0) {
        return res.status(404).json({ error: 'Relación no encontrada o sin cambios' });
      }

      res.json({ mensaje: 'Relación actualizada correctamente' });
    } catch (error) {
      res.status(400).json({ error: 'Error al actualizar relación', detalle: error.message });
    }
  },

  // ❌ Eliminar una relación
  async eliminar(req, res) {
    const id = req.params.id;

    try {
      const eliminado = await RelacionAcudiente.destroy({
        where: { id_relacion: id }
      });

      if (eliminado === 0) {
        return res.status(404).json({ error: 'Relación no encontrada' });
      }

      res.json({ mensaje: 'Relación eliminada correctamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar relación' });
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
          [db.Sequelize.fn('COUNT', db.Sequelize.col('acudientes.id_acudiente')), 'cantidad']
        ],
        group: ['RelacionAcudiente.id_relacion']
      });

      res.json(relaciones);
    } catch (error) {
      console.error('Error al contar acudientes por relación:', error);
      res.status(500).json({ error: 'Error al contar acudientes por relación' });
    }
  }

};

module.exports = relacionAcudienteController;
