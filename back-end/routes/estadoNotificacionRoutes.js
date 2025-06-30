const express = require('express');
const router = express.Router();
const estadoNotificacionController = require('../controllers/estadoNotificacionController');

// Crear nuevo estado de notificación
router.post('/', estadoNotificacionController.crear);

// Obtener todos los estados
router.get('/', estadoNotificacionController.obtenerTodos);

// Buscar por nombre (query param ?nombre=)
router.get('/buscar', estadoNotificacionController.buscarPorNombre);

// Contar total de estados
router.get('/contar/total', estadoNotificacionController.contar);

// Obtener un estado por ID
router.get('/:id', estadoNotificacionController.obtenerPorId);

// Obtener notificaciones asociadas a un estado
router.get('/:id/notificaciones', estadoNotificacionController.notificacionesPorEstado);

// Actualizar un estado
router.put('/:id', estadoNotificacionController.actualizar);

// Eliminar un estado
router.delete('/:id', estadoNotificacionController.eliminar);

module.exports = router;
