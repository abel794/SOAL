const express = require('express');
const router = express.Router();
const controller = require('../controllers/sexoController');

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

// 📊 Contar personas por sexo
router.get('/estadistica/personas', controller.contarPersonasPorSexo);

module.exports = router;
