const express = require('express');
const router = express.Router();
const controller = require('../controllers/usuarioController');

// Buscar por nombre_usuario
router.get('/buscar', controller.buscar);

// Activar/Inactivar usuario individual
router.put('/activar/:id', controller.activar);
router.put('/inactivar/:id', controller.inactivar);

// Activar/Inactivar todos
router.put('/activar-todos', controller.activarTodos);
router.put('/inactivar-todos', controller.inactivarTodos);

// Rutas CRUD principales
router.get('/', controller.obtenerTodos);
router.get('/:id', controller.obtenerPorId);
router.post('/', controller.crear);
router.put('/:id', controller.actualizar);
router.delete('/:id', controller.eliminar);

module.exports = router;

