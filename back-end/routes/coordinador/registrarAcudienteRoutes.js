const express = require('express');
const router = express.Router();

// Solo necesitas importar el controlador correcto UNA VEZ
const registrarAcudienteCompleto = require('../../controllers/controlador_coordinador/registrarAcudienteController');

// Ruta POST para registrar persona + usuario + acudiente
router.post('/', registrarAcudienteCompleto.registrarTodo);

module.exports = router;

