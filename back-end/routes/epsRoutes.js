const express = require('express');
const router = express.Router();
const epsController = require('../controllers/epsController');

// Crear nueva EPS
router.post('/', epsController.crear);

// Listar todas las EPS
router.get('/', epsController.listar);

// Buscar EPS por nombre (query param ?nombre=)
router.get('/buscar', epsController.buscarPorNombre);

// Obtener EPS por ID con estudiantes asignados
router.get('/:id/estudiantes', epsController.verEstudiantes);

// Actualizar EPS por ID
router.put('/:id', epsController.actualizar);

// Eliminar EPS por ID
router.delete('/:id', epsController.eliminar);

// Contar total de EPS
router.get('/contar/total', epsController.contar);

module.exports = router;
