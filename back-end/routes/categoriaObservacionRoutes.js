const express = require('express');
const router = express.Router();
const categoriaObservacionController = require('../controllers/categoriaObservacionController');

// Obtener todas las categorías
router.get('/', categoriaObservacionController.obtenerTodas);

// Buscar categorías por nombre (query param ?nombre=)
router.get('/buscar', categoriaObservacionController.buscarPorNombre);

// Contar todas las categorías
router.get('/contar/todas', categoriaObservacionController.contarCategorias);

// Obtener una categoría por ID
router.get('/:id', categoriaObservacionController.obtenerPorId);

// Crear nueva categoría
router.post('/', categoriaObservacionController.crear);

// Actualizar una categoría por ID
router.put('/:id', categoriaObservacionController.actualizar);

// Eliminar una categoría por ID
router.delete('/:id', categoriaObservacionController.eliminar);

module.exports = router;
