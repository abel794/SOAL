const db = require('../models');
const { Observacion, CategoriaObservacion } = db;
const { Op } = require('sequelize');

const observacionController = {
  // Obtener todas las observaciones
  async obtenerTodas(req, res) {
    try {
      const observaciones = await Observacion.findAll();
      res.json(observaciones);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener observaciones' });
    }
  },

  // Obtener una observación por ID
  async obtenerPorId(req, res) {
    const id = req.params.id;
    try {
      const observacion = await Observacion.findByPk(id);
      if (observacion) {
        res.json(observacion);
      } else {
        res.status(404).json({ error: 'Observación no encontrada' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al buscar la observación' });
    }
  },

  // Crear una nueva observación
  async crear(req, res) {
    try {
      const nueva = await Observacion.create(req.body);
      res.status(201).json(nueva);
    } catch (error) {
      res.status(400).json({ error: 'Error al crear la observación', detalle: error.message });
    }
  },

  // Actualizar una observación
  async actualizar(req, res) {
    const id = req.params.id;
    try {
      const [filasActualizadas] = await Observacion.update(req.body, {
        where: { id_observacion: id }
      });
      if (filasActualizadas === 0) {
        res.status(404).json({ error: 'Observación no encontrada o sin cambios' });
      } else {
        res.json({ mensaje: 'Observación actualizada correctamente' });
      }
    } catch (error) {
      res.status(400).json({ error: 'Error al actualizar la observación' });
    }
  },

  // Eliminar una observación
  async eliminar(req, res) {
    const id = req.params.id;
    try {
      const filasEliminadas = await Observacion.destroy({
        where: { id_observacion: id }
      });
      if (filasEliminadas === 0) {
        res.status(404).json({ error: 'Observación no encontrada' });
      } else {
        res.json({ mensaje: 'Observación eliminada correctamente' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar la observación' });
    }
  },

  // Total de observaciones
  async contarObservaciones(req, res) {
    try {
      const total = await Observacion.count();
      res.json({ totalObservaciones: total });
    } catch (error) {
      res.status(500).json({ error: 'Error al contar observaciones' });
    }
  },

  // Total de observaciones críticas
  async contarCriticos(req, res) {
    try {
      const categoria = await CategoriaObservacion.findOne({
        where: { nombre_categoria: 'Disciplinaria' }
      });
      if (!categoria) return res.status(404).json({ error: 'Categoría crítica no encontrada' });

      const total = await Observacion.count({
        where: { id_categoria: categoria.id_categoria }
      });
      res.json({ observacionesCriticas: total });
    } catch (error) {
      res.status(500).json({ error: 'Error al contar observaciones críticas' });
    }
  }
};

module.exports = observacionController;
