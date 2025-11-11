// 📁 controllers/notificacionController.js
const db = require('../models');
const Notificacion = db.Notificacion;
const EstadoNotificacion = db.EstadoNotificacion;

const notificacionController = {
  // 🔹 Obtener todas las notificaciones de un acudiente
  async obtenerPorAcudiente(req, res) {
    const { idAcudiente } = req.params;
    try {
      const notificaciones = await Notificacion.findAll({
        where: { id_acudiente: idAcudiente },
        include: [
          { model: EstadoNotificacion, as: 'estado', attributes: ['id_estado_notificacion', 'nombre'] }
        ],
        order: [['fecha_envio', 'DESC']]
      });
      res.json(notificaciones);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener notificaciones', detalle: error.message });
    }
  },

  // 🔹 Marcar una notificación como leída
  async marcarLeida(req, res) {
    const { id } = req.params;

    try {
      // Buscamos el estado "leída" (ajusta el nombre si tu estado se llama diferente)
      const estadoLeida = await EstadoNotificacion.findOne({ where: { nombre: 'Leída' } });
      if (!estadoLeida) return res.status(400).json({ error: 'No existe el estado "Leída"' });

      const [actualizado] = await Notificacion.update(
        { id_estado_notificacion: estadoLeida.id_estado_notificacion },
        { where: { id_notificacion: id } }
      );

      if (actualizado === 0) {
        return res.status(404).json({ error: 'Notificación no encontrada o ya actualizada' });
      }

      res.json({ mensaje: 'Notificación marcada como leída' });
    } catch (error) {
      res.status(500).json({ error: 'Error al marcar como leída', detalle: error.message });
    }
  },

  // 🔹 Opcional: crear notificación
  async crear(req, res) {
    const { id_acudiente, mensaje, id_canal, id_estado_notificacion, id_observacion } = req.body;
    if (!id_acudiente || !mensaje || !id_canal || !id_estado_notificacion) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    try {
      const notificacion = await Notificacion.create({
        id_acudiente,
        mensaje,
        id_canal,
        id_estado_notificacion,
        id_observacion: id_observacion || null
      });
      res.status(201).json({ mensaje: 'Notificación creada', notificacion });
    } catch (error) {
      res.status(500).json({ error: 'Error al crear notificación', detalle: error.message });
    }
  }
};

module.exports = notificacionController;
