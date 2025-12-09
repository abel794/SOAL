// routes/estudianteGradoRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../../controllers/controlador_coordinador/estudiantegradoController');

/* ------------------------------------------
   📌 RUTAS PRINCIPALES (CRUD BÁSICO)
-------------------------------------------*/

// Listar todas las asignaciones estudiante-grado
router.get('/', controller.listar);

// Asignar un estudiante a un grado
router.post('/', controller.asignar);

// Buscar asignaciones por ID de estudiante
router.get('/estudiante/:id_estudiante', controller.buscarPorEstudiante);

// Buscar asignaciones por ID de grado
router.get('/grado/:id', controller.obtenerPorGrado);

// Buscar asignaciones por año académico
router.get('/anio', controller.buscarPorAnio);

// Actualizar estado de asignación (activo/inactivo)
router.put('/estado/:id', controller.actualizarEstado);


/* ------------------------------------------
   📊 CONSULTAS Y ESTADÍSTICAS
-------------------------------------------*/

// Contar estudiantes por ID de grado
router.get('/contar', controller.contarPorGrado);

// Total estudiantes matriculados
router.get('/total', controller.contarEstudiantesMatriculados);

// Contar estudiantes por nombre de grado
router.get('/count/grado/:nombre', controller.contarPorNombreDeGrado);


/* ------------------------------------------
   🎓 RUTAS NUEVAS → PROMOCIÓN / HISTORIAL
-------------------------------------------*/

// Promover estudiante
router.post('/:id_estudiante/promover', controller.promoverEstudiante);

// Reprobar estudiante
router.post('/:id_estudiante/reprobar', controller.reprobarEstudiante);

// Historial completo del estudiante
router.get('/:id_estudiante/historial', controller.obtenerHistorialCompleto);

// Obtener grado actual
router.get('/:id_estudiante/grado-actual', controller.obtenerGradoActual);

// Listar por grado y año
router.get('/listar/grado-anio', controller.listarPorGradoYAnio);

// Verificar si puede ser promovido
router.get('/:id_estudiante/verificar-promocion', controller.verificarPromocion);


module.exports = router;
