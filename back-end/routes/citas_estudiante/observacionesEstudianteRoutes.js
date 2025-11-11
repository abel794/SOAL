// routes/citas_estudiante/observacionesEstudianteRoutes.js
const express = require('express');
const router = express.Router();
const observacionesController = require('../../controllers/controlador_estudiante/observaciones_estudiante');
const { verificarToken, verificarRol } = require('../../middlewares/authMiddleware');

// ✅ Todas las rutas requieren token y rol Estudiante
router.use(verificarToken, verificarRol(['Estudiante']));

// 📌 Obtener todas las observaciones del estudiante autenticado
router.get('/', observacionesController.listar);

module.exports = router;
