const express = require('express');
const router = express.Router();
const controller = require('../controllers/estudiantegradoController');

// Asignar estudiante a grado
router.post('/', controller.asignar);

// Obtener grados de un estudiante
router.get('/estudiante/:id_estudiante', controller.gradosDeEstudiante);

// Obtener estudiantes de un grado
router.get('/grado/:id_grado', controller.estudiantesDeGrado);

// Eliminar una asignación
router.delete('/:id_estudiante/:id_grado', controller.eliminar);

// Obtener todas las asignaciones
router.get('/', controller.listar);

module.exports = router;
