const express = require('express');
const router = express.Router();
const controller = require('../controllers/asistenciaController');

// Rutas específicas primero
router.get('/estudiante/:id', controller.porEstudiante);
router.get('/profesor/:id', controller.porProfesor);
router.get('/fecha/:fecha', controller.porFecha); // 👉 ¡Antes del '/' general!

// Rutas generales
router.get('/', controller.obtenerTodas);
router.post('/', controller.registrar);

module.exports = router;


