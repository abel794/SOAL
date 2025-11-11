const db = require('../../models');
const { HistorialPqr, Pqr, Usuario, EstadoPqr } = db;

const historialPqrController = {
  // 📌 1. Guardar respuesta y actualizar estado de PQR
  async responderPqr(req, res) {
    try {
      const { id } = req.params; // id de la PQR
      const { mensaje, id_estado_pqr } = req.body;
      const id_usuario = req.usuario.id_usuario; // desde token

      // Validaciones mínimas
      if (!mensaje || !id_estado_pqr) {
        return res.status(400).json({ mensaje: 'Debe enviar mensaje y estado' });
      }

      // Verificar que la PQR exista
      const pqr = await Pqr.findByPk(id);
      if (!pqr) {
        return res.status(404).json({ mensaje: 'PQR no encontrada' });
      }

      // Crear historial
      const nuevoHistorial = await HistorialPqr.create({
        id_pqr: id,
        id_usuario,
        mensaje,
        id_estado_pqr
      });

      // Actualizar estado en PQR principal
      await pqr.update({ id_estado_pqr });

      return res.json({
        mensaje: 'Respuesta registrada',
        historial: nuevoHistorial
      });
    } catch (error) {
      console.error('❌ Error en responderPqr:', error);
      res.status(500).json({ mensaje: 'Error interno', detalle: error.message });
    }
  },

  // 📌 2. Listar historial de una PQR
  async listarHistorial(req, res) {
    try {
      const { id } = req.params;

      const historial = await HistorialPqr.findAll({
        where: { id_pqr: id },
        include: [
          {
            model: Usuario,
            as: 'usuario_respuesta', // alias que pusimos único
            attributes: ['id_usuario', 'username', 'numero_documento']
          },
          {
            model: EstadoPqr,
            as: 'estado_historial', // alias único que pusimos
            attributes: ['id_estado_pqr', 'nombre']
          }
        ],
        order: [['fecha', 'DESC']]
      });

      return res.json(historial);
    } catch (error) {
      console.error('❌ Error en listarHistorial:', error);
      res.status(500).json({ mensaje: 'Error interno', detalle: error.message });
    }
  }
};

module.exports = historialPqrController;
