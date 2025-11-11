const express = require('express');
const router = express.Router();
const controller = require('../../controllers/controlador_coordinador/personaController');

// 🔍 Buscar por nombre o apellido
router.get('/buscar', controller.buscarPorNombre);

// 📄 Obtener todas las personas
router.get('/', controller.listarTodas);

// 📄 Obtener una persona por número de documento
router.get('/:documento', controller.obtenerPorDocumento);

// ➕ Crear persona
router.post('/', controller.crear);

// ✏️ Actualizar persona por documento
router.put('/:documento', controller.actualizar);

// 🗑️ Eliminar persona por documento
router.delete('/:documento', controller.eliminar);

module.exports = router;
