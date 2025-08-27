// back-end/routes/profesor/asistencias.js
const express = require('express');
const router = express.Router();
const asistenciaController = require('../controllers/Profesor/asistenciaController');

// Rutas específicas primero
router.get('/estudiante/:id', asistenciaController.porEstudiante);
router.get('/profesor/:id', asistenciaController.porProfesor);
router.get('/fecha/:fecha', asistenciaController.porFecha);
router.get('/contar/estado/:estado', asistenciaController.contarPorEstado);

// Registrar
router.post('/registrar', asistenciaController.registrar);
router.post('/registrar-masivo', asistenciaController.registrarMasivo);
router.post('/registrar-por-grado/:id_grado', asistenciaController.registrarPorGrado);

// Obtener todas
router.get('/', asistenciaController.obtenerTodas);

// Filtro
router.get('/filtro/estado', asistenciaController.filtrar);

// Actualizar
router.put('/:id', asistenciaController.actualizar);

// Eliminar
router.delete('/:id', asistenciaController.eliminar);

module.exports = router;
