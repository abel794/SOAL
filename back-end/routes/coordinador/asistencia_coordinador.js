// routes/coordinador/asistencia_coordinador.js
const express = require('express');
const router = express.Router();

// 🔹 Controlador de asistencias
const asistenciaController = require('../../controllers/controlador_coordinador/asistenciaController');

// 🔹 Middlewares de autenticación y rol
const { verificarToken, verificarRol } = require('../../middlewares/authMiddleware');

// ✅ Solo coordinadores pueden acceder a estas rutas
router.use(verificarToken, verificarRol(['Coordinador']));

// 📌 Crear asistencia individual
router.post('/', asistenciaController.registrar);

// 📌 Listar todas las asistencias
router.get('/', asistenciaController.obtenerTodas);

// 📌 Buscar asistencias por estudiante
router.get('/estudiante/:id', asistenciaController.porEstudiante);

// 📌 Buscar asistencias por profesor
router.get('/profesor/:id', asistenciaController.porProfesor);

// 📌 Buscar asistencias por fecha
router.get('/fecha/:fecha', asistenciaController.porFecha);

// 📌 Filtrar asistencias por estado y/o fecha
router.get('/filter', asistenciaController.filtrar);

// 📌 Contar asistencias por estado
router.get('/count/estado/:estado', asistenciaController.contarPorEstado);

// 📌 Registrar asistencias masivas
router.post('/masivo', asistenciaController.registrarMasivo);

// 📌 Registrar asistencia de todo un grado
router.post('/grado/:id_grado', asistenciaController.registrarPorGrado);

// 📌 Obtener asistencia por ID
router.get('/:id', asistenciaController.obtenerPorId);

// 📌 Actualizar asistencia
router.put('/:id', asistenciaController.actualizar);

// 📌 Eliminar asistencia
router.delete('/:id', asistenciaController.eliminar);

module.exports = router;
