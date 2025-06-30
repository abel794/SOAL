const express = require('express');
const router = express.Router();
const controller = require('../controllers/tipoUsuarioController');

// 🔍 Obtener todos los tipos de usuario
router.get('/', controller.obtenerTodos);

// 🔍 Obtener un tipo por ID
router.get('/:id', controller.obtenerPorId);

// 🆕 Crear nuevo tipo de usuario
router.post('/', controller.crear);

// ✏️ Actualizar tipo de usuario
router.put('/:id', controller.actualizar);

// ❌ Eliminar tipo de usuario
router.delete('/:id', controller.eliminar);

// 📊 Contar usuarios por tipo
router.get('/estadistica/usuarios', controller.contarUsuariosPorTipo);

module.exports = router;
