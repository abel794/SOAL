const express = require('express');
const router = express.Router();
const controller = require('../controllers/profesorGradoController');

router.post('/', controller.asignar);
router.get('/profesor/:id', controller.gradosPorProfesor);
router.get('/grado/:id', controller.profesoresPorGrado);
router.get('/', controller.obtenerTodas);
router.delete('/:id_profesor/:id_grado', controller.eliminarAsignacion);

module.exports = router;