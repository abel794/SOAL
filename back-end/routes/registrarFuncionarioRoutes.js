const express = require('express');
const router = express.Router();

// ✅ Nombre correcto del controlador (cambia el nombre para que coincida con lo que hace)
const registrarFuncionarioCompleto = require('../controllers/registrarFuncionario');

// ✅ Ruta POST para registrar persona + usuario + funcionario
router.post('/', registrarFuncionarioCompleto.registrarTodo);

module.exports = router;

