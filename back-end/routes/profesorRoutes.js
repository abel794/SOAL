const express = require('express');
const router = express.Router();
const profesorController = require('../controllers/profesorController');

// 🔍 Buscar profesor por nombre
router.get('/buscar', profesorController.buscarPorNombre);

// 📋 Obtener grados asignados a un profesor
router.get('/:id/grados', profesorController.gradosAsignados);

// ➕ Asignar grado a profesor
router.post('/asignar-grado', profesorController.asignarGrado);

// 📚 CRUD básico
router.get('/', profesorController.obtenerTodos);
router.get('/:id', profesorController.obtenerPorId);
router.post('/', profesorController.crear);
router.put('/:id', profesorController.actualizar);
router.delete('/:id', profesorController.eliminar);

module.exports = router;
