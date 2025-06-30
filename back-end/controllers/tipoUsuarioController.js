const db = require('../models');
const TipoUsuario = db.TipoUsuario;
const Usuario = db.Usuario;
const { Sequelize } = db;

const tipoUsuarioController = {

  // 🔍 Obtener todos los tipos de usuario
  async obtenerTodos(req, res) {
    try {
      const tipos = await TipoUsuario.findAll();
      res.json(tipos);
    } catch (error) {
      console.error('❌ Error al obtener tipos de usuario:', error);
      res.status(500).json({ error: 'Error al obtener tipos de usuario' });
    }
  },

  // 🔍 Obtener un tipo de usuario por ID
  async obtenerPorId(req, res) {
    try {
      const tipo = await TipoUsuario.findByPk(req.params.id);
      if (!tipo) return res.status(404).json({ error: 'Tipo de usuario no encontrado' });
      res.json(tipo);
    } catch (error) {
      res.status(500).json({ error: 'Error al buscar tipo de usuario' });
    }
  },

  // 🆕 Crear un nuevo tipo de usuario
  async crear(req, res) {
    try {
      const nuevo = await TipoUsuario.create(req.body);
      res.status(201).json(nuevo);
    } catch (error) {
      res.status(400).json({ error: 'Error al crear tipo de usuario', detalle: error.message });
    }
  },

  // ✏️ Actualizar un tipo de usuario
  async actualizar(req, res) {
    try {
      const actualizado = await TipoUsuario.update(req.body, {
        where: { id_tipo_usuario: req.params.id }
      });
      if (actualizado[0] === 0) {
        return res.status(404).json({ error: 'Tipo de usuario no encontrado o sin cambios' });
      }
      res.json({ mensaje: 'Tipo de usuario actualizado correctamente' });
    } catch (error) {
      res.status(400).json({ error: 'Error al actualizar tipo de usuario' });
    }
  },

  // ❌ Eliminar un tipo de usuario
  async eliminar(req, res) {
    try {
      const eliminado = await TipoUsuario.destroy({
        where: { id_tipo_usuario: req.params.id }
      });
      if (eliminado === 0) return res.status(404).json({ error: 'Tipo de usuario no encontrado' });
      res.json({ mensaje: 'Tipo de usuario eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar tipo de usuario' });
    }
  },

  // 📊 (Opcional) Contar usuarios por tipo
  async contarUsuariosPorTipo(req, res) {
    try {
      const conteo = await TipoUsuario.findAll({
        attributes: [
          'nombre',
          [Sequelize.fn('COUNT', Sequelize.col('usuarios.id_usuario')), 'cantidad']
        ],
        include: [{
          model: Usuario,
          as: 'usuarios',
          attributes: []
        }],
        group: ['TipoUsuario.id_tipo_usuario']
      });

      res.json(conteo);
    } catch (error) {
      console.error('❌ Error al contar usuarios por tipo:', error);
      res.status(500).json({ error: 'Error al contar usuarios por tipo' });
    }
  }

};

module.exports = tipoUsuarioController;
