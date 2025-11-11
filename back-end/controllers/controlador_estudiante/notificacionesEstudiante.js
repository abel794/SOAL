const db = require('../../models');
const { Notificacion, EstudianteAcudiente } = db;

const notificacionesController = {
  // Listar todas las notificaciones de los acudientes del estudiante
  async listar(req, res) {
    try {
      console.log("🟢 [LISTAR] Notificaciones estudiante...");
      const { id_estudiante } = req.user;

      if (!id_estudiante) {
        return res.status(400).json({ error: "No se encontró id_estudiante en el token." });
      }

      const relaciones = await EstudianteAcudiente.findAll({
        where: { id_estudiante },
        attributes: ['id_acudiente'],
      });

      const idAcudientes = relaciones.map(r => r.id_acudiente);
      if (idAcudientes.length === 0) return res.json([]); // estudiante sin acudientes

      const notificaciones = await Notificacion.findAll({
        where: { id_acudiente: idAcudientes },
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

      console.log(`📬 Se encontraron ${notificaciones.length} notificaciones para el estudiante.`);
      res.json(notificaciones);

    } catch (error) {
      console.error("❌ Error al obtener notificaciones del estudiante:", error);
      res.status(500).json({ error: "Error al obtener notificaciones", detalle: error.message });
    }
  }
};

module.exports = notificacionesController;
