// routes/citas_estudiante.js
const express = require('express');
const router = express.Router();
const citaController = require('../../controllers/controlador_estudiante/notificaciones_estudiante');
const { verificarToken, verificarRol } = require('../../middlewares/authMiddleware');

// ✅ Todas las rutas requieren token y rol Estudiante
router.use(verificarToken, verificarRol(['Estudiante']));

// Obtener citas/notificaciones del estudiante autenticado
router.get('/', citaController.obtenerPorEstudiante);

// Obtener citas/notificaciones de un estudiante específico (por id)
router.get('/:id_estudiante', citaController.obtenerPorEstudiante);

module.exports = router;
