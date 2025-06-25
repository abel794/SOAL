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

  // ✅ Crear una nueva categoría con validación
  async crear(req, res) {
    const { nombre_categoria } = req.body;

    if (!nombre_categoria || nombre_categoria.trim() === "") {
      return res.status(400).json({ error: 'El nombre de la categoría es obligatorio' });
    }

    try {
      const nueva = await CategoriaObservacion.create({ nombre_categoria });
      res.status(201).json(nueva);
    } catch (error) {
      res.status(400).json({ error: 'Error al crear la categoría', detalle: error.message });
    }
  },

  // ✅ Actualizar una categoría existente con validación
  async actualizar(req, res) {
    const id = req.params.id;
    const { nombre_categoria } = req.body;

    if (!nombre_categoria || nombre_categoria.trim() === "") {
      return res.status(400).json({ error: 'El nombre de la categoría no puede estar vacío' });
    }

    try {
      const [filasActualizadas] = await CategoriaObservacion.update(
        { nombre_categoria },
        { where: { id_categoria: id } }
      );

      if (filasActualizadas === 0) {
        res.status(404).json({ error: 'Categoría no encontrada o sin cambios' });
      } else {
        console.log('🟡 ID recibido:', id);
        console.log('🟡 Body recibido:', req.body);
        res.json({ mensaje: 'Categoría actualizada correctamente' });
      }
    } catch (error) {
      console.error(error);
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
