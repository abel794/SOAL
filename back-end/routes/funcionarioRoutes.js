const express = require('express');
const router = express.Router();
const funcionarioController = require('../controllers/funcionarioController');

// 🔍 Buscar funcionarios por nombre (query param: ?nombre=Juan)
router.get('/buscar', funcionarioController.buscarPorNombre);

// 📊 Contar por cargo (query param: ?cargo=docente)
router.get('/contar', funcionarioController.contarPorCargo);

// 🎓 Filtrar por escolaridad (query param: ?id_escolaridad=1)
router.get('/escolaridad', funcionarioController.filtrarPorEscolaridad);

// 📋 Obtener todos los funcionarios (con relaciones)
router.get('/todos', funcionarioController.obtenerTodos);

// 📚 Obtener grados asignados a un funcionario
router.get('/:id/grados', funcionarioController.gradosAsignados);

// ➕ Asignar grado a funcionario
router.post('/asignar-grado', funcionarioController.asignarGrado);

// 📄 CRUD básico
router.get('/:id', funcionarioController.obtenerPorId);
router.post('/', funcionarioController.crear);
router.put('/:id', funcionarioController.actualizar);
router.delete('/:id', funcionarioController.eliminar);

module.exports = router;

