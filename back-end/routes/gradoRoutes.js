const express = require('express');
const router = express.Router();
const controller = require('../controllers/gradoController');

// 🔍 Buscar grados por nombre (query param ?nombre=Primero)
router.get('/buscar', controller.buscarPorNombre);

// 📊 Contar estudiantes en un grado
router.get('/:id/contar', controller.contarEstudiantes);

// 👥 Obtener funcionarios asignados a un grado
router.get('/:id/funcionarios', controller.funcionariosAsignados);

// 📄 CRUD Grados
router.get('/', controller.listarTodos);         // Listar todos los grados
router.get('/:id', controller.obtenerPorId);     // Obtener un grado por ID
router.post('/', controller.crear);              // Crear nuevo grado
router.put('/:id', controller.actualizar);       // Actualizar grado por ID
router.delete('/:id', controller.eliminar);      // Eliminar grado por ID

module.exports = router;


