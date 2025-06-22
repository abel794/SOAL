const express = require('express');
const router = express.Router();
const controller = require('../controllers/estudianteController');

// ✅ Primero las rutas más específicas
router.get('/buscar/termino', controller.buscar);
router.get('/count/grado/:nombre', controller.contarPorGrado);
router.get('/buscar', controller.buscar); // se usaría como /api/estudiantes/buscar?termino=Juan



// Luego las rutas generales
router.get('/', controller.obtenerTodos);
router.get('/:id', controller.obtenerPorId);
router.post('/', controller.crear);
router.put('/:id', controller.actualizar);
router.delete('/:id', controller.eliminar);

module.exports = router;
