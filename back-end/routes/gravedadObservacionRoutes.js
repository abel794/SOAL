const express = require('express');
const router = express.Router();
const controller = require('../controllers/gravedadObservacionController');

// ✅ Listar todas las gravedades
router.get('/', controller.listarTodos);

// 🔍 Buscar gravedad por nombre
// Ejemplo: /gravedades/buscar?nombre=leve
router.get('/buscar', controller.buscarPorNombre);

// 📊 Contar cuántas gravedades existen
router.get('/contar', controller.contar);

// 📊 Porcentaje de observaciones por gravedad
router.get('/porcentaje', controller.porcentajePorGravedad);

// 📋 Ver observaciones asociadas a una gravedad específica
router.get('/:id/observaciones', controller.observacionesPorGravedad);

// 📝 Crear nueva gravedad
router.post('/', controller.crear);

// ✏️ Actualizar gravedad por ID
router.put('/:id', controller.actualizar);

// 🗑️ Eliminar gravedad por ID
router.delete('/:id', controller.eliminar);

module.exports = router;
