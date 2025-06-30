const express = require('express');
const router = express.Router();
const canalController = require('../controllers/canalNotificacionController');

// Obtener todos los canales
router.get('/', canalController.obtenerTodos);

// Obtener un canal por ID
router.get('/:id', canalController.obtenerPorId);

// Crear un nuevo canal
router.post('/', canalController.crear);

// Actualizar un canal existente
router.put('/:id', canalController.actualizar);

// Eliminar un canal
router.delete('/:id', canalController.eliminar);

module.exports = router;
