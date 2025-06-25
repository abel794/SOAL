const express = require('express');
const router = express.Router();
const controller = require('../controllers/historialObservacionController');

// 🔍 Buscar historial por nombre de estudiante
router.get('/buscar', controller.historialPorNombreEstudiante);

// 🔍 Obtener historial por estudiante
router.get('/estudiante/:id_estudiante', controller.obtenerPorEstudiante);

// 📄 Obtener historial por observación
router.get('/observacion/:id', controller.historialPorObservacion);

// 📄 Obtener todos los historiales
router.get('/', controller.obtenerTodos);

// 📄 Obtener historial por ID (¡Debe ir después!)
router.get('/:id', controller.obtenerPorId);

// ➕ Crear nuevo historial
router.post('/', controller.crear);

// ❌ Eliminar historial
router.delete('/:id', controller.eliminar);

module.exports = router;

