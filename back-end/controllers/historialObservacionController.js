const db = require('../models');
const { HistorialObservacion, Observacion, Estudiante } = db;
const { Op } = require('sequelize');


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
    const { id_estudiante, id_profesor, id_observacion, fecha } = req.body;

    if (!id_estudiante || !id_profesor || !id_observacion || !fecha) {
      return res.status(400).json({
        error: 'Todos los campos son obligatorios: id_estudiante, id_profesor, id_observacion y fecha.'
      });
    }

    try {
      const nuevo = await HistorialObservacion.create({
        id_estudiante,
        id_profesor,
        id_observacion,
        fecha
      });

      res.status(201).json(nuevo);
    } catch (error) {
      res.status(400).json({
        error: 'Error al crear el historial',
        detalle: error.message
      });
    }
  },

  // ✅ Obtener historial por observación
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

  // ✅ Obtener historial por estudiante
  async obtenerPorEstudiante(req, res) {
    const { id_estudiante } = req.params;
    try {
      const historial = await HistorialObservacion.findAll({
        include: [
          {
            model: Observacion,
            attributes: ['descripcion', 'fecha', 'gravedad'],
            where: { id_estudiante },
            include: [
              {
                model: Estudiante,
                attributes: ['nombre']
              }
            ]
          }
        ],
        order: [['fecha_modificacion', 'DESC']]
      });

      res.json(historial);
    } catch (error) {
      console.error('❌ Error al obtener historial:', error);
      res.status(500).json({ error: 'Error al obtener historial del estudiante' });
    }
  },

  async historialPorNombreEstudiante(req, res) {
    const { nombre } = req.query;

    if (!nombre) {
      return res.status(400).json({ error: 'Debes proporcionar un nombre' });
    }

    try {
      const historial = await HistorialObservacion.findAll({
        include: [
          {
            model: Observacion,
            where: {},
            include: [
              {
                model: Estudiante,
                attributes: ['nombre'],
                where: {
                  nombre: { [Op.like]: `%${nombre}%` } // Búsqueda flexible
                }
              }
            ]
          }
        ],
        order: [['fecha_modificacion', 'DESC']]
      });

      if (historial.length === 0) {
        return res.status(404).json({ mensaje: 'No hay historial para ese nombre' });
      }

      res.json(historial);
      } catch (error) {
        console.error('❌ Error al obtener historial:', error);
        res.status(500).json({ error: 'Error al obtener historial del estudiante' });
      }
    },
  

  // ✅ Eliminar historial
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

