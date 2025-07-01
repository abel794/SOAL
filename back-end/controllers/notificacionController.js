const db = require('../models');
const { Op } = require('sequelize');

const Notificacion = db.Notificacion;
const Acudiente = db.Acudiente;
const CanalNotificacion = db.CanalNotificacion;
const EstadoNotificacion = db.EstadoNotificacion;

const notificacionController = {
  // 📨 Crear notificación automática
  async crearAutomatica({ id_acudiente, mensaje, id_canal = 1, id_estado_notificacion = 1 }) {
    try {
      const notificacion = await Notificacion.create({
        id_acudiente,
        mensaje,
        id_canal,
        id_estado_notificacion
      });
      console.log("✅ Notificación generada automáticamente.");
      return notificacion;
    } catch (error) {
      console.error("❌ Error creando notificación automática:", error.message);
    }
  },

  // 📋 Listar todas las notificaciones
  async listar(req, res) {
    try {
      const resultados = await Notificacion.findAll({
        include: [
          {
            model: Acudiente,
            as: 'acudiente'
          },
          {
            model: CanalNotificacion,
            as: 'canal'
          },
          {
            model: EstadoNotificacion,
            as: 'estado'
          }
        ],
        order: [['fecha_envio', 'DESC']]
      });
      res.json(resultados);
    } catch (error) {
      console.error("Error al listar notificaciones:", error);
      res.status(500).json({ error: 'Error al listar notificaciones', detalle: error.message });
    }
  },

  // 🔍 Buscar por estado
  async buscarPorEstado(req, res) {
    const id_estado = req.params.id;
    try {
      const notificaciones = await Notificacion.findAll({
        where: { id_estado_notificacion: id_estado },
        include: [{
          model: EstadoNotificacion,
          as: 'estado'
        }]
      });
      res.json(notificaciones);
    } catch (error) {
      console.error("Error al buscar por estado:", error);
      res.status(500).json({ error: 'Error al buscar notificaciones por estado', detalle: error.message });
    }
  },

  // 📊 Contar notificaciones por canal
  async contarPorCanal(req, res) {
    try {
      const resultados = await Notificacion.findAll({
        attributes: [
          'id_canal',
          [db.sequelize.fn('COUNT', db.sequelize.col('id_notificacion')), 'total']
        ],
        group: ['id_canal'],
        include: [{
          model: CanalNotificacion,
          as: 'canal',
          attributes: ['nombre']
        }]
      });
      res.json(resultados);
    } catch (error) {
      console.error("Error al contar por canal:", error);
      res.status(500).json({ error: 'Error al contar notificaciones por canal', detalle: error.message });
    }
  }
};

module.exports = notificacionController;
