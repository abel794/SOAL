const db = require('../models');
const Sexo = db.Sexo;
const Persona = db.Persona;
const { Sequelize } = db;

const sexoController = {
  
  // 🔍 Obtener todos los registros de sexo
  async obtenerTodos(req, res) {
    try {
      const sexos = await Sexo.findAll();
      res.json(sexos);
    } catch (error) {
      console.error('❌ Error al obtener sexos:', error);
      res.status(500).json({ error: 'Error al obtener los sexos' });
    }
  },

  // 🔍 Obtener uno por ID
  async obtenerPorId(req, res) {
    try {
      const sexo = await Sexo.findByPk(req.params.id);
      if (!sexo) return res.status(404).json({ error: 'Sexo no encontrado' });
      res.json(sexo);
    } catch (error) {
      res.status(500).json({ error: 'Error al buscar el sexo' });
    }
  },

  // 🆕 Crear un nuevo sexo
  async crear(req, res) {
    try {
      const nuevo = await Sexo.create(req.body);
      res.status(201).json(nuevo);
    } catch (error) {
      console.error('❌ Error al crear sexo:', error);
      res.status(400).json({ error: 'Error al crear sexo', detalle: error.message });
    }
  },

  // ✏️ Actualizar un sexo
  async actualizar(req, res) {
    try {
      const [actualizado] = await Sexo.update(req.body, {
        where: { id_sexo: req.params.id }
      });
      if (actualizado === 0) return res.status(404).json({ error: 'Sexo no encontrado o sin cambios' });
      res.json({ mensaje: 'Sexo actualizado correctamente' });
    } catch (error) {
      res.status(400).json({ error: 'Error al actualizar sexo', detalle: error.message });
    }
  },

  // ❌ Eliminar un sexo
  async eliminar(req, res) {
    try {
      const eliminado = await Sexo.destroy({
        where: { id_sexo: req.params.id }
      });
      if (eliminado === 0) return res.status(404).json({ error: 'Sexo no encontrado' });
      res.json({ mensaje: 'Sexo eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar sexo' });
    }
  },

  // 📊 Estadística: contar personas por sexo
  async contarPersonasPorSexo(req, res) {
    try {
      const datos = await Sexo.findAll({
        attributes: [
          'nombre',
          [Sequelize.fn('COUNT', Sequelize.col('personas.numero_documento')), 'total']
        ],
        include: [
          {
            model: Persona,
            as: 'personas',
            attributes: []
          }
        ],
        group: ['Sexo.id_sexo']
      });

      res.json(datos);
    } catch (error) {
      console.error('❌ Error al contar personas por sexo:', error);
      res.status(500).json({ error: 'Error al contar personas por sexo' });
    }
  }

};

module.exports = sexoController;
