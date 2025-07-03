const express = require('express');
const router = express.Router();
const controller = require('../controllers/historialObservacionController');

// 🔍 Buscar historial por nombre del estudiante
router.get('/buscar', controller.buscarPorNombreEstudiante);

// 🔍 Buscar historial por nombre del estudiante (alias redundante)
router.get('/buscar/estudiante', controller.historialPorNombreEstudiante);

// 🔍 Buscar historial por nombre del profesor
router.get('/buscar/profesor', controller.buscarPorNombreProfesor);

// 🔍 Buscar historial por rango de fechas (?desde=...&hasta=...)
router.get('/buscar/fechas', controller.buscarPorFecha);

// 📄 Obtener historial por observación específica
router.get('/observacion/:id', controller.historialPorObservacion);

// 📄 Obtener historial por estudiante
router.get('/estudiante/:id_estudiante', controller.obtenerPorEstudiante);

// 📋 Obtener todos los historiales
router.get('/', controller.listarTodos);

// 📄 Obtener historial por ID individual
router.get('/:id', controller.obtenerPorId);

// ➕ Crear nuevo historial
router.post('/', controller.crear);

// ❌ Eliminar historial
router.delete('/:id', controller.eliminar);

module.exports = router;
