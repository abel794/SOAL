const express = require('express');
const router = express.Router();
const controller = require('../controllers/sexoController');

// 📊 Contar personas por sexo (más específica, debe ir antes)
router.get('/estadistica/personas', controller.contarPersonasPorSexo);

// 🔍 Obtener todos los sexos
router.get('/', controller.obtenerTodos);

// 🔍 Obtener un sexo por ID
router.get('/:id', controller.obtenerPorId);

// 🆕 Crear un nuevo sexo
router.post('/', controller.crear);

// ✏️ Actualizar un sexo existente
router.put('/:id', controller.actualizar);

// ❌ Eliminar un sexo
router.delete('/:id', controller.eliminar);

module.exports = router;
