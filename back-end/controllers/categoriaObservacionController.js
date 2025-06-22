const db = require('../models');
const CategoriaObservacion = db.CategoriaObservacion;

const categoriaObservacionController = {
  // ✅ Obtener todas las categorías de observación
  async obtenerTodas(req, res) {
    try {
      const categorias = await CategoriaObservacion.findAll();
      res.json(categorias);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener categorías' });
    }
  },

  // ✅ Obtener una categoría por ID
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

  // ✅ Crear una nueva categoría
  async crear(req, res) {
    try {
      const nueva = await CategoriaObservacion.create(req.body);
      res.status(201).json(nueva);
    } catch (error) {
      res.status(400).json({ error: 'Error al crear la categoría', detalle: error.message });
    }
  },

  // ✅ Actualizar una categoría existente
  async actualizar(req, res) {
    const id = req.params.id;
    try {
      const [filasActualizadas] = await CategoriaObservacion.update(req.body, {
        where: { id_categoria: id }
      });

      if (filasActualizadas === 0) {
        res.status(404).json({ error: 'Categoría no encontrada o sin cambios' });
      } else {
        res.json({ mensaje: 'Categoría actualizada correctamente' });
      }
    } catch (error) {
      res.status(400).json({ error: 'Error al actualizar la categoría' });
    }
  },

  // ✅ Eliminar una categoría
  async eliminar(req, res) {
    const id = req.params.id;
    try {
      const filasEliminadas = await CategoriaObservacion.destroy({
        where: { id_categoria: id }
      });

      if (filasEliminadas === 0) {
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
