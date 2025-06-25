const express = require('express');
const router = express.Router();
const controller = require('../controllers/asistenciaController');

// Rutas específicas primero
router.get('/estudiante/:id', controller.porEstudiante);
router.get('/profesor/:id', controller.porProfesor);
router.get('/fecha/:fecha', controller.porFecha);
router.get('/estado/:estado', controller.contarPorEstado);
router.get('/filtro', controller.porEstadoYFecha); // ejemplo: /api/asistencias/filtro?estado=Presente&fecha=2025-06-20

// Rutas generales
router.get('/', controller.obtenerTodas);
router.post('/', controller.registrar);

module.exports = router;

