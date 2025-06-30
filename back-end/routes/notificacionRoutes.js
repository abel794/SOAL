const express = require('express');
const router = express.Router();
const controller = require('../controllers/notificacionController');

// 📋 Listar todas las notificaciones
router.get('/', controller.listar);

// 🔍 Buscar notificaciones por estado (ej: /estado/1)
router.get('/estado/:id', controller.buscarPorEstado);

// 📊 Contar notificaciones por canal
router.get('/contar/canal', controller.contarPorCanal);

module.exports = router;
