const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/asistenciaController');
const asistenciaController = require('../controllers/profesor/asistenciaController');

// Crear asistencia individual
router.post('/', ctrl.registrar);

// Listar todas las asistencias
router.get('/', ctrl.obtenerTodas);

// Buscar asistencias por estudiante
router.get('/estudiante/:id', ctrl.porEstudiante);

// Buscar asistencias por profesor
router.get('/profesor/:id', ctrl.porProfesor);

// Buscar asistencias por fecha
router.get('/fecha/:fecha', ctrl.porFecha);

// Filtrar asistencias por estado y/o fecha
router.get('/filter', ctrl.filtrar);

// Contar asistencias por estado
router.get('/count/estado/:estado', ctrl.contarPorEstado);

// Registrar asistencias masivas
router.post('/masivo', ctrl.registrarMasivo);

// Registrar asistencia de todo un grado
router.post('/grado/:id_grado', ctrl.registrarPorGrado);

// Obtener asistencia por ID (DEBE IR AL FINAL)
router.get('/:id', ctrl.obtenerPorId);

// Actualizar asistencia
router.put('/:id', ctrl.actualizar);

// Eliminar asistencia
router.delete('/:id', ctrl.eliminar);

module.exports = router;
