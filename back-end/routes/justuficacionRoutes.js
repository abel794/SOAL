const express = require('express');
const router = express.Router();
const controller = require('../controllers/justificacionController');

// 📅 Buscar por fecha (individual o rango: ?desde=2025-06-01&hasta=2025-06-29)
router.get('/buscar/fecha', controller.buscarPorFecha);

// 🔍 Buscar justificaciones por estudiante
router.get('/estudiante/:id', controller.buscarPorEstudiante);

// 📋 Listar todas las justificaciones
router.get('/', controller.listarTodas);

// ➕ Crear nueva justificación
router.post('/', controller.crear);

module.exports = router;
