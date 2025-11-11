// 📂 controllers/controlador_acudiente/notificacionesAcudiente.js
const db = require('../../models');
const { Notificacion, Acudiente } = db;

const notificacionesController = {
  // 📩 1️⃣ Listar todas las notificaciones del acudiente logueado
  async listar(req, res) {
    try {
 //     console.log("🟢 [LISTAR] Iniciando controlador de listar notificaciones...");
   //   console.log("📦 Datos del token decodificado:", req.user);

      let { id_acudiente, id_usuario } = req.user || {};

      // Si no viene en el token, buscamos en la tabla acudiente
      if (!id_acudiente && id_usuario) {
     //   console.log("🔍 Buscando acudiente con id_usuario:", id_usuario);

        const acudiente = await Acudiente.findOne({
          where: { id_usuario },
          attributes: ['id_acudiente'],
        });

 //       console.log("📊 Resultado búsqueda acudiente:", acudiente ? acudiente.toJSON() : null);

        if (!acudiente) {
   //       console.warn("⚠️ No se encontró acudiente asociado al usuario.");
          return res.status(404).json({ error: 'No se encontró acudiente para este usuario.' });
        }

        id_acudiente = acudiente.id_acudiente;
      }

      if (!id_acudiente) {
 //       console.error("❌ No se logró obtener el id_acudiente final.");
        return res.status(400).json({ error: 'Usuario no asociado a ningún acudiente.' });
      }

 //     console.log("✅ id_acudiente final obtenido:", id_acudiente);

      // Traemos las notificaciones
      const notificaciones = await Notificacion.findAll({
        where: { id_acudiente },
        attributes: [
          'id_notificacion',
          'mensaje',
          'fecha_envio',
          'id_canal',
          'id_estado_notificacion',
          'id_observacion',
        ],
        order: [['fecha_envio', 'DESC']],
      });

 //     console.log(`📬 Se encontraron ${notificaciones.length} notificaciones.`);

      res.json(notificaciones);
    } catch (error) {
      console.error("❌ Error al obtener notificaciones:", error);
      res.status(500).json({ error: "Error al obtener notificaciones", detalle: error.message });
    }
  },

  // ✏️ 2️⃣ Marcar una sola como leída
  async marcarLeida(req, res) {
    try {
      const { id } = req.params;
//      console.log("🟢 [MARCAR LEÍDA] ID recibido:", id);

      const notificacion = await Notificacion.findByPk(id);
//      console.log("📄 Notificación encontrada:", notificacion ? notificacion.toJSON() : null);

      if (!notificacion) {
//        console.warn("⚠️ Notificación no encontrada con ese ID.");
        return res.status(404).json({ mensaje: '⚠️ Notificación no encontrada.' });
      }

      notificacion.id_estado_notificacion = 2;
      await notificacion.save();

//      console.log("✅ Notificación marcada como leída correctamente.");
      res.json({ mensaje: '✅ Notificación marcada como leída.' });
    } catch (error) {
      console.error("❌ Error al marcar notificación:", error);
      res.status(500).json({ error: "Error al marcar notificación", detalle: error.message });
    }
  },

  // 🟢 3️⃣ Marcar VARIAS como leídas
  async marcarVarias(req, res) {
    try {
  //    console.log("🟢 [MARCAR VARIAS] Cuerpo recibido:", req.body);

      const { ids } = req.body;
      if (!Array.isArray(ids) || ids.length === 0) {
 //       console.warn("⚠️ No se enviaron IDs válidos para marcar.");
        return res.status(400).json({ error: 'Debes enviar un array con los IDs.' });
      }

      const [actualizadas] = await Notificacion.update(
        { id_estado_notificacion: 2 },
        { where: { id_notificacion: ids } }
      );

   //   console.log(`✅ ${actualizadas} notificaciones actualizadas.`);
      res.json({
        mensaje: `✅ ${actualizadas} notificaciones marcadas como leídas.`,
      });
    } catch (error) {
      console.error("❌ Error al marcar notificaciones:", error);
      res.status(500).json({ error: "Error al marcar notificaciones", detalle: error.message });
    }
  },

  // 🔢 4️⃣ Contar notificaciones NO leídas del acudiente logueado
  async contarNoLeidas(req, res) {
    try {
 //     console.log("🟢 [CONTAR NO LEÍDAS] Iniciando conteo...");
 //     console.log("📦 Token recibido:", req.user);

      let { id_acudiente, id_usuario } = req.user || {};

      if (!id_acudiente && id_usuario) {
 //       console.log("🔍 Buscando acudiente con id_usuario:", id_usuario);

        const acudiente = await Acudiente.findOne({
          where: { id_usuario },
          attributes: ['id_acudiente'],
        });

 //       console.log("📊 Resultado búsqueda acudiente:", acudiente ? acudiente.toJSON() : null);

        if (!acudiente) {
 //         console.warn("⚠️ No se encontró acudiente asociado al usuario.");
          return res.status(404).json({ error: 'No se encontró acudiente para este usuario.' });
        }

        id_acudiente = acudiente.id_acudiente;
      }

      if (!id_acudiente) {
        console.error("❌ No se logró obtener el id_acudiente final.");
        return res.status(400).json({ error: 'Usuario no asociado a ningún acudiente.' });
      }

//      console.log("✅ id_acudiente final:", id_acudiente);

      const totalNoLeidas = await Notificacion.count({
        where: {
          id_acudiente,
          id_estado_notificacion: 1, // 1 = no leída
        },
      });

  //    console.log(`📊 Total no leídas para acudiente ${id_acudiente}:`, totalNoLeidas);

      res.json({ totalNoLeidas });
    } catch (error) {
      console.error("❌ Error al contar notificaciones no leídas:", error);
      res.status(500).json({ error: "Error al contar notificaciones no leídas", detalle: error.message });
    }
  },
};

module.exports = notificacionesController;
