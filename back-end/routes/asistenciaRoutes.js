// routes/asistencia.routes.js
const express = require('express');
const router = express.Router();
const asistenciaController = require('../controllers/asistenciaController');

// Registrar nueva asistencia
router.post('/', asistenciaController.registrar);

// Obtener todas las asistencias
router.get('/', asistenciaController.obtenerTodas);

// Buscar asistencias por ID de estudiante
router.get('/estudiante/:id', asistenciaController.porEstudiante);

// Buscar asistencias por ID de funcionario/profesor
router.get('/profesor/:id', asistenciaController.porProfesor);

// Buscar asistencias por fecha exacta (YYYY-MM-DD)
router.get('/fecha/:fecha', asistenciaController.porFecha);

// Contar asistencias por estado (ej: Presente, Ausente, Justificada)
router.get('/estado/:estado/contar', asistenciaController.contarPorEstado);

// Filtrar asistencias por estado y fecha (query params)
router.get('/filtrar', asistenciaController.porEstadoYFecha);

module.exports = router;

