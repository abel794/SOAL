const express = require('express');
const router = express.Router();
const controller = require('../controllers/gradoController');

// 🔍 Buscar por nombre
router.get('/buscar', controller.buscarPorNombre);

// 📊 Contar estudiantes
router.get('/:id/contar', controller.contarEstudiantes);

// 👥 Ver funcionarios asignados
router.get('/:id/funcionarios', controller.funcionariosAsignados);

// 📄 CRUD
router.get('/', controller.listarTodos);
router.get('/:id', controller.obtenerPorId); // Asegúrate que exista en el controlador
router.post('/', controller.crear);
router.put('/:id', controller.actualizar);
router.delete('/:id', controller.eliminar);

module.exports = router;

