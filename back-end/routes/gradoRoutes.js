const express = require('express');
const router = express.Router();
const controller = require('../controllers/gradoController');

// 🔍 Buscar por nombre (debe ir antes de /:id)
router.get('/buscar', controller.buscarPorNombre);

// 📊 Contar estudiantes en un grado (también antes de /:id)
router.get('/:id/contar', controller.contarEstudiantes);

// 📄 CRUD básico
router.get('/', controller.obtenerTodos);
router.get('/:id', controller.obtenerPorId);
router.post('/', controller.crear);
router.put('/:id', controller.actualizar);
router.delete('/:id', controller.eliminar);

module.exports = router;
