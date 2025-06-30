const express = require('express');
const router = express.Router();
const controller = require('../controllers/estudianteController');

// Listar todos los estudiantes con relaciones
router.get('/', controller.listarTodos);

// Buscar por nombre o documento (query: ?filtro=nombre)
router.get('/buscar', controller.buscar);

// Contar estudiantes (opcional: ?id_estado_academico=1)
router.get('/total', controller.contar);

// Obtener un estudiante por ID ← ✅ ESTA ES LA RUTA NUEVA
router.get('/:id', controller.obtenerPorId);

// Crear un nuevo estudiante
router.post('/', controller.crear);

// Actualizar estudiante por ID
router.put('/:id', controller.actualizar);

// Eliminar estudiante por ID
router.delete('/:id', controller.eliminar);

module.exports = router;
