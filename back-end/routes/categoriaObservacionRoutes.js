const express = require('express');
const router = express.Router();
const controller = require('../controllers/categoriaObservacionController');

// Obtener todas las categorías
router.get('/', controller.obtenerTodas);

// Obtener una categoría por ID
router.get('/:id', controller.obtenerPorId);

// Crear una nueva categoría
router.post('/', controller.crear);

// Actualizar una categoría existente
router.put('/:id', controller.actualizar);

// Eliminar una categoría
router.delete('/:id', controller.eliminar);

module.exports = router;
