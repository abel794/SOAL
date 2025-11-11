const express = require('express');
const router = express.Router();
const controller = require('../../controllers/controlador_coordinador/gradoController');

// 🔍 Buscar grados por nombre (query param ?nombre=Primero)
router.get('/buscar', controller.buscarPorNombre);

// 📈 Contar todos los estudiantes del colegio
router.get('/contar/todos', controller.contarTodosLosEstudiantes);

// 📊 Contar estudiantes en un grado específico
router.get('/:id/contar', controller.contarEstudiantes);

// 👩‍🎓 Listar estudiantes de un grado
router.get('/:id/estudiantes', controller.obtenerEstudiantes);

// 👥 Obtener funcionarios asignados a un grado
router.get('/:id/funcionarios', controller.funcionariosAsignados);

// 📄 CRUD Grados
router.get('/', controller.listarTodos);         // Listar todos los grados
router.get('/:id', controller.obtenerPorId);     // Obtener un grado por ID
router.post('/', controller.crear);              // Crear nuevo grado
router.put('/:id', controller.actualizar);       // Actualizar grado por ID
router.delete('/:id', controller.eliminar);      // Eliminar grado por ID

module.exports = router;
