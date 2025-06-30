const express = require('express');
const router = express.Router();
const estadoAsistenciaController = require('../controllers/estadoAsistenciaController');

// Crear un nuevo estado de asistencia
router.post('/', estadoAsistenciaController.crear);

// Obtener todos los estados de asistencia
router.get('/', estadoAsistenciaController.obtenerTodos);

// Buscar por nombre (query param ?nombre=)
router.get('/buscar', estadoAsistenciaController.buscarPorNombre);

// Contar todos los estados existentes
router.get('/contar/total', estadoAsistenciaController.contar);

// Obtener un estado por ID
router.get('/:id', estadoAsistenciaController.obtenerPorId);

// Obtener asistencias relacionadas con un estado
router.get('/:id/asistencias', estadoAsistenciaController.asistenciasPorEstado);

// Actualizar un estado de asistencia por ID
router.put('/:id', estadoAsistenciaController.actualizar);

// Eliminar un estado de asistencia por ID
router.delete('/:id', estadoAsistenciaController.eliminar);

module.exports = router;
