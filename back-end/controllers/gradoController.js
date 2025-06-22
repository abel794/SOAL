const db = require('../models');
const Grado = db.Grado;
const Estudiantegrado = db.Estudiantegrado;
const { Op } = require('sequelize');

const gradoController = {
  // ✅ Obtener todos los grados
  async obtenerTodos(req, res) {
    try {
      const grados = await Grado.findAll();
      res.json(grados);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener grados' });
    }
  },

  // ✅ Obtener un grado por ID
  async obtenerPorId(req, res) {
    const id = req.params.id;
    try {
      const grado = await Grado.findByPk(id);
      if (!grado) {
        return res.status(404).json({ error: 'Grado no encontrado' });
      }
      res.json(grado);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el grado' });
    }
  },

  // ✅ Crear un nuevo grado
  async crear(req, res) {
    try {
      const nuevo = await Grado.create(req.body);
      res.status(201).json(nuevo);
    } catch (error) {
      res.status(400).json({ error: 'Error al crear el grado', detalle: error.message });
    }
  },

  // ✅ Actualizar un grado
  async actualizar(req, res) {
    const id = req.params.id;
    try {
      const [filas] = await Grado.update(req.body, {
        where: { id_grado: id }
      });

      if (filas === 0) {
        res.status(404).json({ error: 'Grado no encontrado o sin cambios' });
      } else {
        res.json({ mensaje: 'Grado actualizado correctamente' });
      }
    } catch (error) {
      res.status(400).json({ error: 'Error al actualizar el grado' });
    }
  },

  // ✅ Eliminar un grado
  async eliminar(req, res) {
    const id = req.params.id;
    try {
      const filas = await Grado.destroy({
        where: { id_grado: id }
      });

      if (filas === 0) {
        res.status(404).json({ error: 'Grado no encontrado' });
      } else {
        res.json({ mensaje: 'Grado eliminado correctamente' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar el grado' });
    }
  },

  // 🔍 Buscar por nombre de grado
  async buscarPorNombre(req, res) {
    const { nombre } = req.query;
    try {
      const grados = await Grado.findAll({
        where: {
          nombre_grado: { [Op.like]: `%${nombre}%` }
        }
      });

      if (grados.length === 0) {
        res.status(404).json({ mensaje: 'No se encontraron grados' });
      } else {
        res.json(grados);
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al buscar grados' });
    }
  },

  // ✅ Contar estudiantes en un grado específico
  async contarEstudiantes(req, res) {
    const id_grado = req.params.id;
    try {
      const total = await Estudiantegrado.count({
        where: { id_grado }
      });
      res.json({ totalEstudiantes: total });
    } catch (error) {
      res.status(500).json({ error: 'Error al contar estudiantes del grado' });
    }
  }
};

module.exports = gradoController;
