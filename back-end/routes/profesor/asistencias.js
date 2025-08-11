// back-end/routes/profesor/asistencias.js
const express = require('express');
const router = express.Router();

const asistenciaController = require('../../controllers/Profesor/asistenciaController');

// Registrar una asistencia individual
router.post('/registrar', asistenciaController.registrar);

// Obtener todas las asistencias
router.get('/', asistenciaController.obtenerTodas);

// Obtener asistencia por ID
router.get('/:id', asistenciaController.obtenerPorId);

// Asistencias por estudiante
router.get('/estudiante/:id', asistenciaController.porEstudiante);

// Asistencias por profesor
router.get('/profesor/:id', asistenciaController.porProfesor);

// Asistencias por fecha
router.get('/fecha/:fecha', asistenciaController.porFecha);

// Filtro por estado o fecha
router.get('/filtro/estado', asistenciaController.filtrar);

// Contar asistencias por estado
router.get('/contar/estado/:estado', asistenciaController.contarPorEstado);

// Registrar asistencias masivas
router.post('/registrar-masivo', asistenciaController.registrarMasivo);

// Registrar asistencia por grado
router.post('/registrar-por-grado/:id_grado', asistenciaController.registrarPorGrado);

// Actualizar asistencia
router.put('/:id', asistenciaController.actualizar);

// Eliminar asistencia
router.delete('/:id', asistenciaController.eliminar);

module.exports = router;
