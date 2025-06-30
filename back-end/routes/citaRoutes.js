const express = require('express');
const router = express.Router();
const citaController = require('../controllers/citaController');

// Crear nueva cita
router.post('/', citaController.crearCita);

// Obtener todas las citas
router.get('/', citaController.obtenerCitas);

// Contar total de citas
router.get('/contar', citaController.contarCitas);

// Buscar por número de documento del estudiante o acudiente
router.get('/buscar/documento', citaController.buscarPorDocumento);

// Buscar por nombre del estudiante o acudiente
router.get('/buscar/nombre', citaController.buscarPorNombre);

module.exports = router;
