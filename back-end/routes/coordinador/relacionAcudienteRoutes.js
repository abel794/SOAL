const express = require('express');
const router = express.Router();
const controller = require('../../controllers/controlador_coordinador/relacionAcudienteController');

// 📊 Contar cuántos acudientes hay por tipo de relación
router.get('/estadistica/cantidad', controller.contarAcudientesPorRelacion);

// 🔍 Obtener todas las relaciones
router.get('/', controller.obtenerTodas);

// 🔍 Obtener una relación por ID
router.get('/:id', controller.obtenerPorId);

// ➕ Crear nueva relación
router.post('/', controller.crear);

// ✏️ Actualizar relación existente
router.put('/:id', controller.actualizar);

// ❌ Eliminar una relación
router.delete('/:id', controller.eliminar);

module.exports = router;
