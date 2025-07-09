const express = require('express');
const router = express.Router();
const controller = require('../controllers/tipoDocumentoController');

// 📊 Contar personas por tipo de documento (específica primero)
router.get('/estadistica/personas', controller.contarPersonasPorTipo);

// 🔍 Obtener todos los tipos de documento
router.get('/', controller.obtenerTodos);

// 🔍 Obtener tipo de documento por ID
router.get('/:id', controller.obtenerPorId);

// 🆕 Crear nuevo tipo de documento
router.post('/', controller.crear);

// ✏️ Actualizar tipo de documento
router.put('/:id', controller.actualizar);

// ❌ Eliminar tipo de documento
router.delete('/:id', controller.eliminar);


module.exports = router;
