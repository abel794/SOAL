// controllers/controlador_acudiente/pqr_acudiente.js
const db = require('../../models');
const { Acudiente, Pqr, TipoPqr, EstadoPqr, Estudiante, EstudianteAcudiente } = db;

const pqrAcudienteController = {
  // Listar todos los PQRs de un acudiente según su usuario (token)
  async listarMisPQR(req, res) {
    try {
      const id_usuario = req.user?.id_usuario;
      if (!id_usuario) return res.status(401).json({ error: 'Token inválido o no autenticado' });

      const acudiente = await Acudiente.findOne({
        where: { id_usuario },
        attributes: ['id_acudiente']
      });
      if (!acudiente) return res.status(404).json({ error: 'Acudiente no encontrado' });

      const pqrsRaw = await Pqr.findAll({
        where: { id_acudiente: acudiente.id_acudiente },
        include: [
          { model: TipoPqr, as: 'tipo', attributes: ['nombre'], required: false },
          { model: EstadoPqr, as: 'estado', attributes: ['nombre'], required: false }
        ],
        order: [['fecha', 'DESC']]
      });

      const pqrs = pqrsRaw.map(p => {
        const j = typeof p.toJSON === 'function' ? p.toJSON() : p;
        const asunto = (j.descripcion ?? "").trim() || "Sin asunto";

        return {
          id_pqr: j.id_pqr,
          id_acudiente: j.id_acudiente,
          asunto,
          tipo: j.tipo?.nombre ?? "Sin tipo",
          estado: j.estado?.nombre ?? "Sin estado",
          fecha: j.fecha
        };
      });

      return res.json(pqrs);
    } catch (error) {
      console.error('❌ Error al listar PQRs del acudiente:', error);
      return res.status(500).json({ error: 'Error al listar historial de PQR', detalle: error.message });
    }
  },

  // Crear un nuevo PQR (el body debe traer al menos id_estudiante y descripcion/asunto)
  async crear(req, res) {
    try {
      const id_usuario = req.user?.id_usuario;
      if (!id_usuario) return res.status(401).json({ error: 'Token inválido o no autenticado' });

      const acudiente = await Acudiente.findOne({
        where: { id_usuario },
        attributes: ['id_acudiente']
      });
      if (!acudiente) return res.status(401).json({ error: 'Usuario no es un acudiente válido' });

      const id_acudiente = acudiente.id_acudiente;

      // Validar estudiantes asignados a este acudiente
      const asignaciones = await EstudianteAcudiente.findAll({
        where: { id_acudiente },
        include: [{ model: Estudiante, as: 'estudiante' }]
      });

      if (!Array.isArray(asignaciones) || asignaciones.length === 0) {
        return res.status(400).json({ error: "No hay estudiantes asignados a este acudiente" });
      }

      // Si el front manda id_estudiante, verificar que pertenezca
      if (req.body.id_estudiante) {
        const estudianteValido = asignaciones.some(a => a.estudiante?.id_estudiante === Number(req.body.id_estudiante));
        if (!estudianteValido) return res.status(401).json({ error: "Estudiante no asignado a este acudiente" });
      }

      // Crear PQR (adaptar campos según modelo Pqr)
      const nuevaPQR = await Pqr.create({
        ...req.body,
        id_acudiente
      });

      return res.status(201).json({ mensaje: "PQR creada correctamente", data: nuevaPQR });
    } catch (error) {
      console.error('❌ [crearPQR] Error al crear PQR:', error);
      return res.status(500).json({ error: "Error al crear PQR", detalle: error.message });
    }
  }
};

module.exports = pqrAcudienteController;
