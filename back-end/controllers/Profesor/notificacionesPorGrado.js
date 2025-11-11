// controllers/profesor/notificacionesPorGrado.js
const db = require('../../models');
const { Notificacion, Estudiante, Acudiente, EstudianteAcudiente, Persona, EstudianteGrado } = db;

const notificacionesGradoController = {
  async enviarAGrado(req, res) {
    try {
      const { id_grado, mensaje } = req.body;
      const idRemitente = req.usuario?.id_usuario;

      if (!id_grado || !mensaje || !idRemitente) {
        return res.status(400).json({ mensaje: "Faltan datos obligatorios." });
      }

      // 🔍 Buscar estudiantes activos del grado desde la tabla estudiante_grado
      const estudiantesGrado = await EstudianteGrado.findAll({
        where: { id_grado, activo: true },
        include: [
          {
            model: Estudiante,
            as: 'estudianteAsignado',
            include: [
              {
                model: EstudianteAcudiente,
                as: 'pivotes', // usa el alias real definido en tu modelo Estudiante
                include: [
                  {
                    model: Acudiente,
                    as: 'acudiente',
                    include: [{ model: Persona, as: 'persona' }]
                  }
                ]
              }
            ]
          }
        ]
      });

      if (!estudiantesGrado.length)
        return res.status(404).json({ mensaje: "No hay estudiantes activos en este grado." });

      // 📬 Crear las notificaciones
      const notificaciones = [];
      for (const eg of estudiantesGrado) {
        const est = eg.estudianteAsignado;
        for (const rel of est?.pivotes || []) {
          if (rel.acudiente) {
            notificaciones.push({
              id_acudiente: rel.acudiente.id_acudiente,
              id_remitente: idRemitente,
              mensaje,
              id_canal: 2, // Canal 2 = notificación grupal por grado
              id_estado_notificacion: 1
            });
          }
        }
      }

      if (notificaciones.length > 0) {
        await Notificacion.bulkCreate(notificaciones);
      }

      res.json({ mensaje: "✅ Notificación enviada a todos los acudientes del grado." });
    } catch (error) {
      console.error("❌ Error enviando notificaciones:", error);
      res.status(500).json({ mensaje: "Error interno", detalle: error.message });
    }
  }
};

module.exports = notificacionesGradoController;
