// routes/citas_coordinador.js
const express = require('express');
const router = express.Router();
const citaController = require('../../controllers/controlador_coordinador/citaController');
//const { verificarToken, verificarRol } = require('../../middlewares/authMiddleware');

// ✅ Todas las rutas requieren token y rol Coordinador
//router.use(verificarToken, verificarRol(['Coordinador','Profesor','Coordinador','Administrativo','Secretaria']));

// Crear nueva cita
router.post('/', citaController.crearCita);

// Contar total de citas
router.get('/contar', citaController.contarCitas);

// Buscar por número de documento
router.get('/buscar/documento', citaController.buscarPorDocumento);

// Buscar por nombre
router.get('/buscar/nombre', citaController.buscarPorNombre);

// Obtener todas las citas
router.get('/', citaController.obtenerCitas);

module.exports = router;
