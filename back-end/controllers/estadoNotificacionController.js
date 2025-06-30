// 📁 controllers/estadoNotificacionController.js

const db = require('../models'); // Importamos los modelos
const EstadoNotificacion = db.EstadoNotificacion; // Modelo principal
const Notificacion = db.Notificacion; // Modelo relacionado
const { Op } = require('sequelize'); // Para búsquedas avanzadas

const estadoNotificacionController = {
  // ✅ Crear un nuevo estado de notificación
  async crear(req, res) {
    const { nombre } = req.body;

    // Validamos que el nombre no esté vacío
    if (!nombre || nombre.trim() === '') {
      return res.status(400).json({ error: 'El nombre es obligatorio' });
    }

    try {
      const estado = await EstadoNotificacion.create({ nombre });
      res.status(201).json({ mensaje: 'Estado creado', estado });
    } catch (error) {
      res.status(400).json({ error: 'Error al crear estado', detalle: error.message });
    }
  },

  // ✅ Obtener todos los estados
  async obtenerTodos(req, res) {
    try {
      const lista = await EstadoNotificacion.findAll();
      res.json(lista);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener estados' });
    }
  },

  // ✅ Obtener un estado por ID
  async obtenerPorId(req, res) {
    const { id } = req.params;
    try {
      const estado = await EstadoNotificacion.findByPk(id);
      if (!estado) return res.status(404).json({ error: 'Estado no encontrado' });
      res.json(estado);
    } catch (error) {
      res.status(500).json({ error: 'Error al buscar el estado' });
    }
  },

  // 🔍 Buscar estados por nombre (parcial)
  async buscarPorNombre(req, res) {
    const { nombre } = req.query;
    try {
      const estados = await EstadoNotificacion.findAll({
        where: {
          nombre: { [Op.like]: `%${nombre}%` }
        }
      });

      if (estados.length === 0) {
        return res.status(404).json({ mensaje: 'No se encontraron coincidencias' });
      }

      res.json(estados);
    } catch (error) {
      res.status(500).json({ error: 'Error al buscar por nombre' });
    }
  },

  // 🔢 Contar cuántos estados hay
  async contar(req, res) {
    try {
      const total = await EstadoNotificacion.count();
      res.json({ total });
    } catch (error) {
      res.status(500).json({ error: 'Error al contar estados' });
    }
  },

  // 🗂 Ver todas las notificaciones con un estado específico
  async notificacionesPorEstado(req, res) {
    const { id } = req.params;
    try {
      const estado = await EstadoNotificacion.findByPk(id, {
        include: [{ model: Notificacion, as: 'notificaciones' }]
      });
      if (!estado) return res.status(404).json({ error: 'Estado no encontrado' });
      res.json(estado);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener notificaciones por estado' });
    }
  },

  // ✏️ Actualizar nombre del estado
  async actualizar(req, res) {
    const { id } = req.params;
    const { nombre } = req.body;

    if (!nombre || nombre.trim() === '') {
      return res.status(400).json({ error: 'El nombre no puede estar vacío' });
    }

    try {
      const [filas] = await EstadoNotificacion.update({ nombre }, {
        where: { id_estado_notificacion: id }
      });

      if (filas === 0) {
        res.status(404).json({ error: 'Estado no encontrado o sin cambios' });
      } else {
        res.json({ mensaje: 'Estado actualizado correctamente' });
      }
    } catch (error) {
      res.status(400).json({ error: 'Error al actualizar estado' });
    }
  },

  // ❌ Eliminar estado
  async eliminar(req, res) {
    const { id } = req.params;
    try {
      const eliminado = await EstadoNotificacion.destroy({ where: { id_estado_notificacion: id } });
      if (!eliminado) return res.status(404).json({ error: 'Estado no encontrado' });
      res.json({ mensaje: 'Estado eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar estado' });
    }
  }
};

// Exportamos el controlador
module.exports = estadoNotificacionController;
