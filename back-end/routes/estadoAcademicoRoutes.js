const express = require('express');
const router = express.Router();
const estadoAcademicoController = require('../controllers/estadoAcademicoController');

// ✅ Rutas específicas primero
router.get('/buscar', estadoAcademicoController.buscarPorNombre);
router.get('/contar/total', estadoAcademicoController.contar);

// ✅ Rutas generales
router.post('/', estadoAcademicoController.crear);
router.get('/', estadoAcademicoController.obtenerTodos);

// ✅ Rutas dinámicas al final
router.get('/:id/estudiantes', estadoAcademicoController.estudiantesPorEstado);
router.get('/:id', estadoAcademicoController.obtenerPorId);
router.put('/:id', estadoAcademicoController.actualizar);
router.delete('/:id', estadoAcademicoController.eliminar);

module.exports = router;
