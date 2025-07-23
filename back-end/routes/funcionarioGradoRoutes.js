// back-end/routes/funcionarioGradoRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/funcionarioGradoController');

// ✅ Crear una asignación (POST /api/funcionariogrados/)
router.post('/', controller.asignar);

// ✅ Listar todas las asignaciones (GET /api/funcionariogrados/)
router.get('/', controller.listarTodos);

// ✅ Obtener asignaciones de un funcionario (GET /api/funcionariogrados/por-funcionario/:id_funcionario)
router.get('/por-funcionario/:id_funcionario', controller.gradosPorFuncionario);

// ✅ Filtrar asignaciones por rol (GET /api/funcionariogrados/filtrar-rol?rol=...)
router.get('/filtrar-rol', controller.filtrarPorRol);

// ✅ Contar asignaciones de un grado (GET /api/funcionariogrados/contar? id_grado=...)
router.get('/contar', controller.contarPorGrado);

// ✅ Eliminar una asignación (DELETE /api/funcionariogrados/:id)
router.delete('/:id', controller.eliminar);

module.exports = router;
