const express = require('express');
const router = express.Router();
const controller = require('../controllers/pqrController');

// ➕ Crear un nuevo PQR
router.post('/', controller.crear);

// 📄 Obtener todos los PQRs con detalles
router.get('/', controller.listarTodos);

// 📄 Obtener un PQR específico por ID
router.get('/:id', controller.obtenerPorId);

// ✏️ Actualizar estado del PQR
router.put('/:id', controller.actualizarEstado);

// 🗑️ Eliminar un PQR
router.delete('/:id', controller.eliminar);

// 🔍 Listar PQRs por acudiente
router.get('/acudiente/:id', controller.listarPorAcudiente);

// 🔍 Listar PQRs por estado
router.get('/estado/:id_estado', controller.listarPorEstado);

// 📊 Contar PQRs por tipo (petición, queja, reclamo)
router.get('/estadistica/tipo', controller.contarPorTipo);

// 📊 Contar PQRs por estado (pendiente, cerrado, etc.)
router.get('/estadistica/estado', controller.contarPorEstado);

module.exports = router;
