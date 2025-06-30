const db = require('../models');
const TipoDocumento = db.TipoDocumento;
const Persona = db.Persona;
const { Sequelize } = db;

const tipoDocumentoController = {

  // 🔍 Obtener todos los tipos de documento
  async obtenerTodos(req, res) {
    try {
      const tipos = await TipoDocumento.findAll();
      res.json(tipos);
    } catch (error) {
      console.error('❌ Error al obtener tipos de documento:', error);
      res.status(500).json({ error: 'Error al obtener tipos de documento' });
    }
  },

  // 🔍 Obtener un tipo por ID
  async obtenerPorId(req, res) {
    try {
      const tipo = await TipoDocumento.findByPk(req.params.id);
      if (!tipo) return res.status(404).json({ error: 'Tipo de documento no encontrado' });
      res.json(tipo);
    } catch (error) {
      res.status(500).json({ error: 'Error al buscar el tipo de documento' });
    }
  },

  // 🆕 Crear nuevo tipo
  async crear(req, res) {
    try {
      const nuevo = await TipoDocumento.create(req.body);
      res.status(201).json(nuevo);
    } catch (error) {
      console.error('❌ Error al crear tipo de documento:', error);
      res.status(400).json({ error: 'Error al crear tipo de documento', detalle: error.message });
    }
  },

  // ✏️ Actualizar tipo de documento
  async actualizar(req, res) {
    try {
      const [actualizado] = await TipoDocumento.update(req.body, {
        where: { id_tipo_documento: req.params.id }
      });
      if (actualizado === 0) return res.status(404).json({ error: 'Tipo de documento no encontrado o sin cambios' });
      res.json({ mensaje: 'Tipo de documento actualizado correctamente' });
    } catch (error) {
      res.status(400).json({ error: 'Error al actualizar tipo de documento' });
    }
  },

  // ❌ Eliminar
  async eliminar(req, res) {
    try {
      const eliminado = await TipoDocumento.destroy({
        where: { id_tipo_documento: req.params.id }
      });
      if (eliminado === 0) return res.status(404).json({ error: 'Tipo de documento no encontrado' });
      res.json({ mensaje: 'Tipo de documento eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar tipo de documento' });
    }
  },

  // 📊 Contar personas por tipo de documento
  async contarPersonasPorTipo(req, res) {
    try {
      const datos = await TipoDocumento.findAll({
        attributes: [
          'nombre',
          [Sequelize.fn('COUNT', Sequelize.col('personas.numero_documento')), 'total']
        ],
        include: [{
          model: Persona,
          as: 'personas',
          attributes: []
        }],
        group: ['TipoDocumento.id_tipo_documento']
      });

      res.json(datos);
    } catch (error) {
      console.error('❌ Error al contar personas por tipo de documento:', error);
      res.status(500).json({ error: 'Error al contar personas por tipo de documento' });
    }
  }
};

module.exports = tipoDocumentoController;
