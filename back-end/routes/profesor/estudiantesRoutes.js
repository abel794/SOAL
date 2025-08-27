// routes/profesor/estudiantesRoutes.js
const express = require('express');
const router = express.Router();
const { obtenerEstudiantesAsignados } = require('../../controllers/Profesor/estudiantesController');

// GET /api/profesor/estudiantes?profesorId=XX
router.get('/', obtenerEstudiantesAsignados);

module.exports = router;
