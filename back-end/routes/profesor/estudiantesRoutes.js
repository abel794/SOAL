const express = require('express');
const router = express.Router();
const { obtenerEstudiantesAsignados } = require('../../controllers/profesor/estudiantesController');

// GET /api/profesor/estudiantes?profesorId=XX
router.get('/estudiantes', obtenerEstudiantesAsignados);

module.exports = router;
