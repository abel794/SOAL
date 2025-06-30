const express = require('express');
const router = express.Router();
const controller = require('../controllers/estudianteGradoController');

// Rutas organizadas
router.get('/', controller.listar); // Listar todos
router.post('/', controller.asignar); // Asignar grado
router.get('/estudiante/:id_estudiante', controller.buscarPorEstudiante); // Buscar por estudiante
router.get('/anio', controller.buscarPorAnio); // Filtrar por año académico
router.put('/estado/:id', controller.actualizarEstado); // Activar o desactivar asignación
router.get('/contar', controller.contarPorGrado); // Contar por id_grado (opcional anio)
router.get('/total', controller.contarEstudiantesMatriculados); // Total estudiantes activos
router.get('/count/grado/:nombre', controller.contarPorNombreDeGrado); // Por nombre grado

module.exports = router;
