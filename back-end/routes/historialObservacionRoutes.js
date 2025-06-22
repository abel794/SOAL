// routes/historialObservacionRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/historialObservacionController');

router.get('/', controller.obtenerTodos);
router.get('/:id', controller.obtenerPorId);
router.get('/observacion/:id', controller.historialPorObservacion);
router.post('/', controller.crear);
router.delete('/:id', controller.eliminar);

module.exports = router;