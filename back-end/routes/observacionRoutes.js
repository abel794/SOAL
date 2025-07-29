const express = require('express');
const router = express.Router();
const controller = require('../controllers/observacionController');

// 📊 Totales y porcentajes
router.get('/contar', controller.contarObservaciones); // Total general
router.get('/contar/categoria', controller.contarPorCategoriaConPorcentaje); // Por porcentaje
router.get('/contar/gravedad', controller.contarPorGravedad); // Por gravedad
router.get('/contar/tipo', controller.contarPorTipo); // Por tipo de observación
router.get('/contar/criticas', controller.contarCriticos); // Solo disciplinarias
router.get('/criticas', controller.listarCriticos);// Listar críticas
router.put('/:id', controller.actualizar);// Actualizar observación


// 📋 Listado general con detalles
router.get('/detalles', controller.listarConDetalles);

// 🔍 Buscar por ID
router.get('/:id', controller.obtenerPorId);

// ➕ Crear observación y notificación
router.post('/', controller.crear);

// ✏️ Actualizar (con registro en historial)
router.put('/:id', controller.actualizar);

// 🗑️ Eliminar observación
router.delete('/:id', controller.eliminar);

module.exports = router;

