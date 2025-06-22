const db = require('../models');
const HistorialObservacion = db.HistorialObservacion;
const Observacion = db.Observacion;

const historialController = {
  // ✅ Obtener todos los historiales
  async obtenerTodos(req, res) {
    try {
      const historial = await HistorialObservacion.findAll({
        include: {
          model: Observacion,
          attributes: ['descripcion', 'fecha_observacion']
        }
      });
      res.json(historial);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el historial' });
    }
  },

  // ✅ Obtener historial por ID
  async obtenerPorId(req, res) {
    const id = req.params.id;
    try {
      const registro = await HistorialObservacion.findByPk(id, {
        include: Observacion
      });
      if (!registro) {
        return res.status(404).json({ error: 'Registro no encontrado' });
      }
      res.json(registro);
    } catch (error) {
      res.status(500).json({ error: 'Error al buscar el historial' });
    }
  },

  // ✅ Crear nuevo registro de historial
  async crear(req, res) {
    try {
      const nuevo = await HistorialObservacion.create(req.body);
      res.status(201).json(nuevo);
    } catch (error) {
      res.status(400).json({ error: 'Error al crear el historial', detalle: error.message });
    }
  },

  // ✅ Obtener historial por ID de observación
  async historialPorObservacion(req, res) {
    const id_observacion = req.params.id;
    try {
      const historial = await HistorialObservacion.findAll({
        where: { id_observacion }
      });

      if (historial.length === 0) {
        return res.status(404).json({ mensaje: 'No hay historial para esta observación' });
      }

      res.json(historial);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener historial por observación' });
    }
  },

  // ✅ Eliminar registro del historial
  async eliminar(req, res) {
    const id = req.params.id;
    try {
      const filas = await HistorialObservacion.destroy({
        where: { id_historial: id }
      });

      if (filas === 0) {
        res.status(404).json({ error: 'Registro de historial no encontrado' });
      } else {
        res.json({ mensaje: 'Registro eliminado correctamente' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar el historial' });
    }
  }
};

module.exports = historialController;
