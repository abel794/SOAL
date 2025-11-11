const express = require('express');
const router = express.Router();
const controller = require('../../controllers/controlador_coordinador/pqrController');
const historialController = require('../../controllers/controlador_coordinador/historialPqrController');
const verificarToken = require('../../middlewares/verificarToken');

// 📄 Obtener todos los PQRs con detalles
router.get('/', verificarToken, controller.listarTodos);

// 🔍 Listar PQRs por estado
router.get('/estado/:id_estado', verificarToken, controller.listarPorEstado);

// 📊 Contar PQRs por tipo (petición, queja, reclamo)
router.get('/estadistica/tipo', verificarToken, controller.contarPorTipo);

// 📊 Contar PQRs por estado (pendiente, cerrado, etc.)
router.get('/estadistica/estado', verificarToken, controller.contarPorEstado);

// 📌 Responder PQR
router.post('/:id/responder', verificarToken, historialController.responderPqr);

// Listar historial de una PQR (general)
router.get('/:id/historial', verificarToken, historialController.listarHistorial);

// 📄 Obtener un PQR específico por ID
router.get('/:id', verificarToken, controller.obtenerPorId);

// ✏️ Actualizar estado del PQR
router.put('/:id', verificarToken, controller.actualizarEstado);

// 🗑️ Eliminar un PQR
router.delete('/:id', verificarToken, controller.eliminar);

module.exports = router;
