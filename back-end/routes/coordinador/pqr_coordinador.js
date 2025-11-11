// routes/coordinador/pqr_coordinador.js
const express = require('express');
const router = express.Router();

const pqrController = require('../../controllers/controlador_coordinador/pqrController');
const historialPqrController = require('../../controllers/controlador_coordinador/historialPqrController');
const verificarToken = require('../../middlewares/verificarToken');

// 📄 Obtener todos los PQRs con detalles
router.get('/', verificarToken, pqrController.listarTodos);

// 🔍 Listar PQRs por estado
router.get('/estado/:id_estado', verificarToken, pqrController.listarPorEstado);

// 📊 Contar PQRs por tipo (petición, queja, reclamo)
router.get('/estadistica/tipo', verificarToken, pqrController.contarPorTipo);

// 📊 Contar PQRs por estado (pendiente, cerrado, etc.)
router.get('/estadistica/estado', verificarToken, pqrController.contarPorEstado);

// 📬 Responder a una PQR
router.post('/:id/responder', verificarToken, historialPqrController.responderPqr);

// 📜 Listar historial de una PQR (general para coordinador)
router.get('/:id/historial', verificarToken, historialPqrController.listarHistorial);

// 📄 Obtener un PQR específico por ID
router.get('/:id', verificarToken, pqrController.obtenerPorId);

// ✏️ Actualizar estado del PQR
router.put('/:id', verificarToken, pqrController.actualizarEstado);

// 🗑️ Eliminar un PQR
router.delete('/:id', verificarToken, pqrController.eliminar);

module.exports = router;
