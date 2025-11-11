const express = require('express');
const router = express.Router();
const controller = require('../../controllers/controlador_coordinador/estudiantegradoController');

// 📄 Listar todas las asignaciones estudiante-grado
router.get('/', controller.listar);

// 🆕 Asignar un estudiante a un grado
router.post('/', controller.asignar);

// 🔍 Buscar asignaciones por ID de estudiante
router.get('/estudiante/:id_estudiante', controller.buscarPorEstudiante);

// 🔍 Buscar asignaciones por ID de grado
router.get('/por-grado/:id', controller.obtenerPorGrado);

// 🔍 Buscar asignaciones por año académico
router.get('/anio', controller.buscarPorAnio);

// ♻️ Actualizar estado
router.put('/estado/:id', controller.actualizarEstado);

// 📊 Contar estudiantes por ID de grado
router.get('/contar', controller.contarPorGrado);

// 📊 Total estudiantes matriculados
router.get('/total', controller.contarEstudiantesMatriculados);

// 📊 Contar estudiantes por nombre de grado
router.get('/count/grado/:nombre', controller.contarPorNombreDeGrado);

module.exports = router;
