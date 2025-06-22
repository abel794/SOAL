const express = require('express');
const router = express.Router();
const controller = require('../controllers/citaController');

// 🟢 Obtener el total de citas (debe ir primero para evitar conflicto con rutas dinámicas)
router.get('/total', controller.contarCitas);

// 🔵 Crear una nueva cita
router.post('/', controller.crearCita);

// 🔵 Obtener todas las citas
router.get('/', controller.obtenerCitas);

module.exports = router;
