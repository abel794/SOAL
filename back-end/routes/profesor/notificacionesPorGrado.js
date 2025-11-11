// 📂 routes/profesor/notificacionesPorGrado.js
const express = require('express');
const router = express.Router();

// Importar controlador y middlewares
const notificacionesGradoController = require('../../controllers/Profesor/notificacionesPorGrado');
const verificarToken = require('../middlewares/verificarToken');
const verificarRol = require('../middlewares/verificarRol');

// 📩 Ruta para enviar notificación a todos los estudiantes de un grado
router.post(
  '/enviar-grado',
  verificarToken,
  verificarRol(['Profesor']), // 👈 Corrigido: solo profesores pueden usar este endpoint
  notificacionesGradoController.enviarAGrado
);

module.exports = router;
