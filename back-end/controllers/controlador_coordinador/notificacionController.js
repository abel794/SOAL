const db = require('../../models');
const { Op } = require('sequelize');

const { Notificacion, Acudiente, CanalNotificacion, EstadoNotificacion } = db;

const notificacionController = {
  // 📨 Crear notificación automática (sin req/res)
  async crearAutomatica({ id_acudiente, mensaje, id_canal = 1, id_estado_notificacion = 1 }) {
    try {
      if (!id_acudiente || !mensaje) {
        throw new Error("Faltan datos obligatorios (id_acudiente o mensaje).");
      }

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

  // 📋 Listar todas las notificaciones con filtros dinámicos
  async listar(req, res) {
    try {
      const {
        id_acudiente,
        id_estado,
        id_canal,
        fecha_inicio,
        fecha_fin,
        numero_documento
      } = req.query;

      // 🧱 Construcción de filtros dinámicos
      const where = {};
      const include = [
        {
          model: Acudiente,
          as: "acudiente",
          where: numero_documento ? { numero_documento } : undefined,
        },
        { model: CanalNotificacion, as: "canal" },
        { model: EstadoNotificacion, as: "estado" },
      ];

      if (id_acudiente) where.id_acudiente = id_acudiente;
      if (id_estado) where.id_estado_notificacion = id_estado;
      if (id_canal) where.id_canal = id_canal;

      // 📅 Filtro por rango de fechas
      if (fecha_inicio && fecha_fin) {
        where.fecha_envio = { [Op.between]: [fecha_inicio, fecha_fin] };
      }

      // 🔍 Ejecutar la consulta
      const resultados = await Notificacion.findAll({
        where,
        include,
        order: [["fecha_envio", "DESC"]],
      });

      // 🟢 Respuesta
      res.json(resultados);
    } catch (error) {
      console.error("Error al listar notificaciones:", error);
      res.status(500).json({
        error: "Error al listar notificaciones",
        detalle: error.message,
      });
    }
  },

  // 🔍 Buscar notificaciones por estado
  async buscarPorEstado(req, res) {
    const id_estado = req.params.id;
    try {
      const notificaciones = await Notificacion.findAll({
        where: { id_estado_notificacion: id_estado },
        include: [
          { model: EstadoNotificacion, as: "estado" },
          { model: Acudiente, as: "acudiente" },
        ],
      });
      res.json(notificaciones);
    } catch (error) {
      console.error("Error al buscar por estado:", error);
      res.status(500).json({
        error: "Error al buscar notificaciones por estado",
        detalle: error.message,
      });
    }
  },

  // 📊 Contar notificaciones por canal
  async contarPorCanal(req, res) {
    try {
      const resultados = await Notificacion.findAll({
        attributes: [
          "id_canal",
          [db.sequelize.fn("COUNT", db.sequelize.col("id_notificacion")), "total"],
        ],
        group: ["id_canal"],
        include: [{ model: CanalNotificacion, as: "canal", attributes: ["nombre"] }],
      });
      res.json(resultados);
    } catch (error) {
      console.error("Error al contar por canal:", error);
      res.status(500).json({
        error: "Error al contar notificaciones por canal",
        detalle: error.message,
      });
    }
  },

  // ✏️ Actualizar estado de notificación
  async actualizarEstado(req, res) {
    const { id } = req.params;
    const { id_estado_notificacion } = req.body;

    try {
      const notificacion = await Notificacion.findByPk(id);
      if (!notificacion) {
        return res.status(404).json({ error: "Notificación no encontrada" });
      }

      await notificacion.update({ id_estado_notificacion });
      res.json({ mensaje: "Estado de notificación actualizado", notificacion });
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      res.status(500).json({
        error: "Error al actualizar estado de la notificación",
        detalle: error.message,
      });
    }
  },

  // 🗑️ Eliminar notificación
  async eliminar(req, res) {
    const { id } = req.params;
    try {
      const eliminado = await Notificacion.destroy({ where: { id_notificacion: id } });
      if (eliminado === 0) {
        return res.status(404).json({ error: "Notificación no encontrada" });
      }
      res.json({ mensaje: "Notificación eliminada correctamente" });
    } catch (error) {
      console.error("Error al eliminar notificación:", error);
      res.status(500).json({
        error: "Error al eliminar notificación",
        detalle: error.message,
      });
    }
  },
};

module.exports = notificacionController;
