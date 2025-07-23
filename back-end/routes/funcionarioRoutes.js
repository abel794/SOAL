// routes/funcionarioRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/funcionarioController');

// 🔄 CRUD básico
router.get('/todos', controller.obtenerTodos);
router.get('/:id', controller.obtenerPorId);
router.post('/', controller.crear);
router.put('/:id', controller.actualizar);
router.delete('/:id', controller.eliminar);

// 🔍 Búsqueda avanzada
router.get('/buscar', controller.buscarPorNombre);               // ?nombre=...
router.get('/cedula/:numero_documento', controller.obtenerPorDocumento);

// 📊 Estadísticas y filtros
router.get('/contar', controller.contarPorCargo);               // ?cargo=...
router.get('/escolaridad', controller.filtrarPorEscolaridad);   // ?id_escolaridad=...

// 📚 Funcionario–Grado
router.post('/asignar-grado', controller.asignarGrado);
router.get('/:id/grados', controller.gradosAsignados);

module.exports = router;
