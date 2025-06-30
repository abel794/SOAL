const express = require('express');
const router = express.Router();
const estadoAcademicoController = require('../controllers/estadoAcademicoController');

// Crear nuevo estado académico
router.post('/', estadoAcademicoController.crear);

// Obtener todos los estados académicos
router.get('/', estadoAcademicoController.obtenerTodos);

// Buscar por nombre (query param ?nombre=)
router.get('/buscar', estadoAcademicoController.buscarPorNombre);

// Contar estados académicos registrados
router.get('/contar/total', estadoAcademicoController.contar);

// Obtener estado académico por ID
router.get('/:id', estadoAcademicoController.obtenerPorId);

// Ver estudiantes asignados a un estado académico
router.get('/:id/estudiantes', estadoAcademicoController.estudiantesPorEstado);

// Actualizar estado académico por ID
router.put('/:id', estadoAcademicoController.actualizar);

// Eliminar estado académico por ID
router.delete('/:id', estadoAcademicoController.eliminar);

module.exports = router;
