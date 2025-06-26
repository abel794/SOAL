const express = require('express');
const router = express.Router();
const observacionController = require('../controllers/observacionController');

// Rutas específicas primero
router.get('/por-tipo', observacionController.contarPorTipo);
router.get('/por-gravedad', observacionController.contarPorGravedad);
router.get('/detalladas', observacionController.listarConDetalles);
router.get('/total', observacionController.contarObservaciones);
router.get('/criticos', observacionController.contarCriticos);

// CRUD de observaciones
router.get('/', observacionController.obtenerTodas);
router.post('/', observacionController.crear);
router.put('/:id', observacionController.actualizar);
router.delete('/:id', observacionController.eliminar);
router.get('/:id', observacionController.obtenerPorId); // al final

module.exports = router;
