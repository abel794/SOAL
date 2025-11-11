// 📁 controllers/notificacionController.js
const db = require('../../models');
const Notificacion = db.Notificacion;
const EstadoNotificacion = db.EstadoNotificacion;

const notificacionController = {
  // 🔹 Obtener todas las notificaciones del acudiente logueado
  async obtenerPorToken(req, res) {
    try {
      const idUsuario = req.user?.id_usuario;
      if (!idUsuario) {
        return res.status(401).json({ error: 'Token inválido' });
      }

      const idAcudiente = req.user.id_acudiente;
      if (!idAcudiente) {
        return res.json({ success: true, data: [] });
      }

      const notificaciones = await Notificacion.findAll({
        where: { id_acudiente: idAcudiente },
        include: [
          { model: EstadoNotificacion, as: 'estado', attributes: ['id_estado_notificacion', 'nombre'] }
        ],
        order: [['fecha_envio', 'DESC']]
      });

      res.json({ success: true, data: notificaciones });
    } catch (error) {
      console.error('❌ [obtenerPorToken] Error:', error);
      res.status(500).json({ error: 'Error al obtener notificaciones', detalle: error.message });
    }
  },

  // 🔹 Marcar notificación como leída (solo del usuario logueado)
  async marcarLeida(req, res) {
    try {
      const idUsuario = req.user?.id_usuario;
      if (!idUsuario) {
        return res.status(401).json({ error: 'Token inválido' });
      }

      const idAcudiente = req.user.id_acudiente;
      if (!idAcudiente) {
        return res.status(400).json({ error: 'No se encontró el acudiente' });
      }

      const { id } = req.params;

      const estadoLeida = await EstadoNotificacion.findOne({ where: { nombre: 'Leída' } });
      if (!estadoLeida) return res.status(400).json({ error: 'No existe el estado "Leída"' });

      const [actualizado] = await Notificacion.update(
        { id_estado_notificacion: estadoLeida.id_estado_notificacion },
        { where: { id_notificacion: id, id_acudiente: idAcudiente } } // Solo se actualiza si pertenece al usuario
      );

      if (actualizado === 0) {
        return res.status(404).json({ error: 'Notificación no encontrada o ya actualizada' });
      }

      res.json({ mensaje: 'Notificación marcada como leída' });
    } catch (error) {
      console.error('❌ [marcarLeida] Error:', error);
      res.status(500).json({ error: 'Error al marcar como leída', detalle: error.message });
    }
  },

  // 🔹 Crear notificación (solo para el usuario logueado o administrador)
  async crear(req, res) {
    try {
      const idUsuario = req.user?.id_usuario;
      if (!idUsuario) {
        return res.status(401).json({ error: 'Token inválido' });
      }

      const idAcudiente = req.body.id_acudiente || req.user.id_acudiente;
      const { mensaje, id_canal, id_estado_notificacion, id_observacion } = req.body;

      if (!idAcudiente || !mensaje || !id_canal || !id_estado_notificacion) {
        return res.status(400).json({ error: 'Faltan datos obligatorios' });
      }

      const notificacion = await Notificacion.create({
        id_acudiente: idAcudiente,
        mensaje,
        id_canal,
        id_estado_notificacion,
        id_observacion: id_observacion || null
      });

      res.status(201).json({ mensaje: 'Notificación creada', notificacion });
    } catch (error) {
      console.error('❌ [crear] Error:', error);
      res.status(500).json({ error: 'Error al crear notificación', detalle: error.message });
    }
  }
};

module.exports = notificacionController;
