const express = require('express');
const router = express.Router();
const estadoUsuarioController = require('../controllers/estadoUsuarioController');

// 1. Listar todos los estados
router.get('/', estadoUsuarioController.listarTodos);

// 2. Buscar por nombre (?nombre=)
router.get('/buscar', estadoUsuarioController.buscarPorNombre);

// 3. Contar cuántos estados existen
router.get('/contar/total', estadoUsuarioController.contarEstados);

// 4. Crear un nuevo estado
router.post('/', estadoUsuarioController.crearEstado);

// 5. Actualizar un estado existente
router.put('/:id', estadoUsuarioController.actualizarEstado);

module.exports = router;
