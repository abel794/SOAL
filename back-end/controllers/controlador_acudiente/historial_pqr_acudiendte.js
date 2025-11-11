// controllers/controlador_acudiente/historial_pqr_acudiente.js
const db = require('../../models');
const { HistorialPqr, Usuario, EstadoPqr } = db;

const historialPqrAcudiente = {
  // Listar historial de una PQR específica
  async listarHistorial(req, res) {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ mensaje: 'Falta id de la PQR' });

      // Si necesitas el usuario autenticado, ahora se accede como req.user
      const userId = req.user?.id_usuario;

      const historial = await HistorialPqr.findAll({
        where: { id_pqr: id },
        include: [
          {
            model: Usuario,
            as: 'usuario_respuesta',
            attributes: ['id_usuario', 'username', 'numero_documento'],
            required: false
          },
          {
            model: EstadoPqr,
            as: 'estado_historial',
            attributes: ['id_estado_pqr', 'nombre'],
            required: false
          }
        ],
        order: [['fecha', 'DESC']]
      });

      if (!historial || historial.length === 0) {
        return res.status(404).json({ mensaje: 'No se encontró historial para esta PQR' });
      }

      return res.status(200).json(historial);
    } catch (error) {
      console.error('❌ Error en listarHistorial:', error);
      return res.status(500).json({ mensaje: 'Error interno del servidor', detalle: error.message });
    }
  }
};

module.exports = historialPqrAcudiente;
