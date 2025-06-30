// Importamos el modelo y operador Sequelize
const db = require('../models');
const CategoriaObservacion = db.CategoriaObservacion;
const { Op } = require('sequelize');

const categoriaObservacionController = {
  // ✅ Obtener todas las categorías
  async obtenerTodas(req, res) {
    try {
      const categorias = await CategoriaObservacion.findAll();
      res.json({
        total: categorias.length,    // 🔢 Total de registros
        categorias                   // 📦 Lista de resultados
      });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener categorías' });
    }
  },

  // 🔍 Buscar por nombre con coincidencia parcial
  async buscarPorNombre(req, res) {
    const { nombre } = req.query;

    if (!nombre || nombre.trim() === '') {
      return res.status(400).json({ error: 'Debes proporcionar ?nombre=' });
    }

    try {
      const resultados = await CategoriaObservacion.findAll({
        where: {
          nombre: {
            [Op.like]: `%${nombre}%`  // 🔎 Coincidencia flexible
          }
        }
      });

      res.json({
        total: resultados.length,
        resultados
      });
    } catch (error) {
      res.status(500).json({ error: 'Error al buscar por nombre' });
    }
  },

  // 🔢 Contar todas las categorías existentes
  async contarCategorias(req, res) {
    try {
      const total = await CategoriaObservacion.count();
      res.json({ total });
    } catch (error) {
      res.status(500).json({ error: 'Error al contar categorías' });
    }
  },

  // ✅ Obtener una categoría por ID (directo por PK)
  async obtenerPorId(req, res) {
    const id = req.params.id;

    try {
      const categoria = await CategoriaObservacion.findByPk(id);
      if (categoria) {
        res.json(categoria);
      } else {
        res.status(404).json({ error: 'Categoría no encontrada' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al buscar categoría' });
    }
  },

  // ✅ Crear una nueva categoría con validación
  async crear(req, res) {
    const { nombre } = req.body;

    // Validación: campo requerido
    if (!nombre || nombre.trim() === "") {
      return res.status(400).json({ error: 'El nombre de la categoría es obligatorio' });
    }

    try {
      const nueva = await CategoriaObservacion.create({ nombre });
      res.status(201).json(nueva);
    } catch (error) {
      res.status(400).json({ error: 'Error al crear la categoría', detalle: error.message });
    }
  },

  // ✅ Actualizar una categoría con validación
  async actualizar(req, res) {
    const id = req.params.id;
    const { nombre } = req.body;

    // Validación: no vacío
    if (!nombre || nombre.trim() === "") {
      return res.status(400).json({ error: 'El nombre no puede estar vacío' });
    }

    try {
      const [filas] = await CategoriaObservacion.update(
        { nombre },
        { where: { id_categoria: id } }
      );

      if (filas === 0) {
        res.status(404).json({ error: 'Categoría no encontrada o sin cambios' });
      } else {
        res.json({ mensaje: 'Categoría actualizada correctamente' });
      }
    } catch (error) {
      res.status(400).json({ error: 'Error al actualizar la categoría', detalle: error.message });
    }
  },

  // ✅ Eliminar una categoría por ID
  async eliminar(req, res) {
    const id = req.params.id;

    try {
      const filas = await CategoriaObservacion.destroy({
        where: { id_categoria: id }
      });

      if (filas === 0) {
        res.status(404).json({ error: 'Categoría no encontrada' });
      } else {
        res.json({ mensaje: 'Categoría eliminada correctamente' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar la categoría' });
    }
  }
};

module.exports = categoriaObservacionController;
