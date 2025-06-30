const db = require('../models');
const TipoPqr = db.TipoPqr;
const Pqr = db.Pqr;
const { Sequelize } = db;

const tipoPqrController = {

  // 🔍 Obtener todos los tipos de PQR
  async obtenerTodos(req, res) {
    try {
      const tipos = await TipoPqr.findAll();
      res.json(tipos);
    } catch (error) {
      console.error('❌ Error al obtener tipos de PQR:', error);
      res.status(500).json({ error: 'Error al obtener tipos de PQR' });
    }
  },

  // 🔍 Obtener tipo por ID
  async obtenerPorId(req, res) {
    try {
      const tipo = await TipoPqr.findByPk(req.params.id);
      if (!tipo) return res.status(404).json({ error: 'Tipo de PQR no encontrado' });
      res.json(tipo);
    } catch (error) {
      res.status(500).json({ error: 'Error al buscar el tipo de PQR' });
    }
  },

  // 🆕 Crear nuevo tipo de PQR
  async crear(req, res) {
    try {
      const nuevo = await TipoPqr.create(req.body);
      res.status(201).json(nuevo);
    } catch (error) {
      console.error('❌ Error al crear tipo de PQR:', error);
      res.status(400).json({ error: 'Error al crear tipo de PQR', detalle: error.message });
    }
  },

  // ✏️ Actualizar tipo de PQR
  async actualizar(req, res) {
    try {
      const [actualizado] = await TipoPqr.update(req.body, {
        where: { id_tipo_pqr: req.params.id }
      });
      if (actualizado === 0) return res.status(404).json({ error: 'Tipo de PQR no encontrado o sin cambios' });
      res.json({ mensaje: 'Tipo de PQR actualizado correctamente' });
    } catch (error) {
      res.status(400).json({ error: 'Error al actualizar tipo de PQR' });
    }
  },

  // ❌ Eliminar
  async eliminar(req, res) {
    try {
      const eliminado = await TipoPqr.destroy({
        where: { id_tipo_pqr: req.params.id }
      });
      if (eliminado === 0) return res.status(404).json({ error: 'Tipo de PQR no encontrado' });
      res.json({ mensaje: 'Tipo de PQR eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar tipo de PQR' });
    }
  },

  // 📊 Contar PQR por tipo
  async contarPorTipo(req, res) {
    try {
      const datos = await TipoPqr.findAll({
        attributes: [
          'nombre',
          [Sequelize.fn('COUNT', Sequelize.col('pqrs.id_pqr')), 'total']
        ],
        include: [{
          model: Pqr,
          as: 'pqrs',
          attributes: []
        }],
        group: ['TipoPqr.id_tipo_pqr']
      });

      res.json(datos);
    } catch (error) {
      console.error('❌ Error al contar PQR por tipo:', error);
      res.status(500).json({ error: 'Error al contar PQR por tipo' });
    }
  }

};

module.exports = tipoPqrController;
