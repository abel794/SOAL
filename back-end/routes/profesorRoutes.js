const express = require('express');
const router = express.Router();
const profesorCtrl = require('../controllers/Profesor');

// Ruta directa: /api/profesor/estudiantes
router.get('/estudiantes', profesorCtrl.obtenerEstudiantesAsignados);



module.exports = router;
