const express = require('express');
const router = express.Router();
const epsController = require('../controllers/epsController');

// ✅ Rutas específicas primero
router.get('/buscar', epsController.buscarPorNombre);
router.get('/contar/total', epsController.contar);

// ✅ Rutas generales después
router.post('/', epsController.crear);
router.get('/', epsController.listar);

// ✅ Rutas dinámicas al final
router.get('/:id/estudiantes', epsController.verEstudiantes);
router.put('/:id', epsController.actualizar);
router.delete('/:id', epsController.eliminar);

module.exports = router;
