const express = require('express');
const router = express.Router();
const { verificarToken } = require('../../middlewares/authMiddleware');
const notificacionesController = require('../../controllers/controlador_estudiante/notificacionesEstudiante');

// 📬 Listar todas las notificaciones de los acudientes del estudiante
router.get('/', verificarToken, notificacionesController.listar);

module.exports = router;
