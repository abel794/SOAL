// 📁 controllers/epsController.js
const db = require('../models');
const { Eps, Estudiante } = db;
const { Op } = require('sequelize');

const epsController = {
  // ✅ Crear nueva EPS
  async crear(req, res) {
    try {
      const { nombre } = req.body;
      if (!nombre || nombre.trim() === '') {
        return res.status(400).json({ error: 'El nombre es obligatorio' });
      }

      const nuevaEps = await Eps.create({ nombre });
      res.status(201).json({ mensaje: 'EPS creada correctamente', eps: nuevaEps });
    } catch (error) {
      console.error('Error al crear EPS:', error);
      res.status(500).json({ error: 'Error al crear EPS' });
    }
  },

  // ✅ Listar todas las EPS
  async listar(req, res) {
    try {
      const lista = await Eps.findAll();
      res.json(lista);
    } catch (error) {
      console.error('Error al listar EPS:', error);
      res.status(500).json({ error: 'Error al listar EPS' });
    }
  },

  // 🔍 Buscar EPS por nombre (parcial o exacto)
  async buscarPorNombre(req, res) {
    const { nombre } = req.query;
    try {
      const resultados = await Eps.findAll({
        where: {
          nombre: { [Op.like]: `%${nombre}%` }
        }
      });
      res.json(resultados);
    } catch (error) {
      console.error('Error al buscar EPS por nombre:', error);
      res.status(500).json({ error: 'Error al buscar EPS' });
    }
  },

  // 📝 Editar EPS
  async actualizar(req, res) {
    const { id } = req.params;
    const { nombre } = req.body;

    try {
      const [filasActualizadas] = await Eps.update(
        { nombre },
        { where: { id_eps: id } }
      );

      if (filasActualizadas === 0) {
        return res.status(404).json({ mensaje: 'EPS no encontrada o sin cambios' });
      }

      res.json({ mensaje: 'EPS actualizada correctamente' });
    } catch (error) {
      console.error('Error al actualizar EPS:', error);
      res.status(500).json({ error: 'Error al actualizar EPS' });
    }
  },

  // ❌ Eliminar EPS
  async eliminar(req, res) {
    const { id } = req.params;
    try {
      const filas = await Eps.destroy({ where: { id_eps: id } });
      if (filas === 0) {
        return res.status(404).json({ mensaje: 'EPS no encontrada' });
      }
      res.json({ mensaje: 'EPS eliminada correctamente' });
    } catch (error) {
      console.error('Error al eliminar EPS:', error);
      res.status(500).json({ error: 'Error al eliminar EPS' });
    }
  },

  // 🔢 Contar total de EPS
  async contar(req, res) {
    try {
      const total = await Eps.count();
      res.json({ total_eps: total });
    } catch (error) {
      console.error('Error al contar EPS:', error);
      res.status(500).json({ error: 'Error al contar EPS' });
    }
  },

  // 👥 Ver estudiantes asignados a una EPS específica
  async verEstudiantes(req, res) {
    const { id } = req.params;
    try {
      const eps = await Eps.findByPk(id, {
        include: {
          model: Estudiante,
          as: 'estudiantes'
        }
      });

      if (!eps) {
        return res.status(404).json({ mensaje: 'EPS no encontrada' });
      }

      res.json(eps);
    } catch (error) {
      console.error('Error al obtener estudiantes por EPS:', error);
      res.status(500).json({ error: 'Error al obtener estudiantes por EPS' });
    }
  }
};

module.exports = epsController;
