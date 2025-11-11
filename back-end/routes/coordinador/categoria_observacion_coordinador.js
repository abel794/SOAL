// routes/coordinador/categoria_observacion_coordinador.js
const express = require('express');
const router = express.Router();

// 📌 Importamos el controlador
const categoriaObservacionController = require('../../controllers/controlador_coordinador/categoriaObservacionController');

// ✅ Obtener todas las categorías
router.get('/', (req, res) => {
  console.log('[GET] /api/coordinador/categorias → Obtener todas las categorías');
  categoriaObservacionController.obtenerTodas(req, res);
});

// ✅ Buscar categorías por nombre (?nombre=)
router.get('/buscar', (req, res) => {
  console.log('[GET] /api/coordinador/categorias/buscar → Query:', req.query);
  categoriaObservacionController.buscarPorNombre(req, res);
});

// ✅ Contar todas las categorías
router.get('/contar/todas', (req, res) => {
  console.log('[GET] /api/coordinador/categorias/contar/todas');
  categoriaObservacionController.contarCategorias(req, res);
});

// ✅ Contar observaciones por categoría
router.get('/contar/categoria', (req, res) => {
  console.log('[GET] /api/coordinador/categorias/contar/categoria');
  categoriaObservacionController.contarPorCategoria(req, res);
});

// ✅ Obtener una categoría por ID
router.get('/:id', (req, res) => {
  console.log('[GET] /api/coordinador/categorias/:id → Params:', req.params);
  categoriaObservacionController.obtenerPorId(req, res);
});

// ✅ Crear nueva categoría
router.post('/', (req, res) => {
  console.log('[POST] /api/coordinador/categorias → Body:', req.body);
  categoriaObservacionController.crear(req, res);
});

// ✅ Actualizar una categoría por ID
router.put('/:id', (req, res) => {
  console.log('[PUT] /api/coordinador/categorias/:id → Params:', req.params, 'Body:', req.body);
  categoriaObservacionController.actualizar(req, res);
});

// ✅ Eliminar una categoría por ID
router.delete('/:id', (req, res) => {
  console.log('[DELETE] /api/coordinador/categorias/:id → Params:', req.params);
  categoriaObservacionController.eliminar(req, res);
});

module.exports = router;
