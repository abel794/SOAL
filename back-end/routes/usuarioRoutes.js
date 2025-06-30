const express = require('express');
const router = express.Router();
const controller = require('../controllers/usuarioController');

// 🔍 Buscar usuarios por nombre de usuario
router.get('/buscar', controller.buscar);

// 🔄 Activar o inactivar por número de documento
router.put('/cambiar-estado/:numero_documento', controller.cambiarEstadoPorDocumento);

// 🔄 Activar todos
router.put('/activar-todos', controller.activarTodos);

// 🔄 Inactivar todos
router.put('/inactivar-todos', controller.inactivarTodos);

// 🔄 Activar por ID
router.put('/activar/:id', controller.activar);

// 🔄 Inactivar por ID
router.put('/inactivar/:id', controller.inactivar);

// 🔍 Obtener todos
router.get('/', controller.obtenerTodos);

// 🔍 Obtener uno por ID
router.get('/:id', controller.obtenerPorId);

// 🆕 Crear usuario
router.post('/', controller.crear);

// ✏️ Actualizar usuario
router.put('/:id', controller.actualizar);

// ❌ Eliminar usuario
router.delete('/:id', controller.eliminar);

module.exports = router;


