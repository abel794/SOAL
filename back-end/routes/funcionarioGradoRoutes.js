const express = require('express');
const router = express.Router();
const controller = require('../controllers/funcionarioGradoController');

router.post('/', controller.asignar);
router.get('/', controller.listarTodos);
router.get('/filtrar/rol', controller.filtrarPorRol);
router.get('/contar', controller.contarPorGrado);
router.get('/:id_funcionario/grados', controller.gradosPorFuncionario);
router.delete('/:id', controller.eliminar); // opcional

module.exports = router;
