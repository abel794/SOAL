const express = require('express');
const router = express.Router();
const controller = require('../controllers/tipoPqrController');

// 🔍 Obtener todos los tipos de PQR
router.get('/', controller.obtenerTodos);

// 🔍 Obtener un tipo de PQR por ID
router.get('/:id', controller.obtenerPorId);

// 🆕 Crear un nuevo tipo de PQR
router.post('/', controller.crear);

// ✏️ Actualizar tipo de PQR
router.put('/:id', controller.actualizar);

// ❌ Eliminar tipo de PQR
router.delete('/:id', controller.eliminar);

// 📊 Contar PQRs por tipo
router.get('/estadistica/pqrs', controller.contarPorTipo);

module.exports = router;
