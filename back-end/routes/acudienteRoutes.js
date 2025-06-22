const express = require('express');
const router = express.Router();
const controller = require('../controllers/acudienteController');

router.get('/buscar', controller.buscarPorNombre);
router.get('/:id/estudiantes', controller.estudiantesDeAcudiente);
router.get('/', controller.obtenerTodos);
router.get('/:id', controller.obtenerPorId);
router.post('/', controller.crear);
router.put('/:id', controller.actualizar);
router.delete('/:id', controller.eliminar);

module.exports = router;