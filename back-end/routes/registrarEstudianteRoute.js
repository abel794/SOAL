const express = require('express');
const router = express.Router();
const registrarEstudianteCompleto = require('../controllers/registroEstudianteController');

router.post('/', registrarEstudianteCompleto.registrarTodo); // 👈 llamada a la función única

module.exports = router;
