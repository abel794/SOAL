const express = require('express');
const router = express.Router();
const verificarToken = require('../middlewares/verificarToken');
const profesorCtrl = require('../controllers/Profesor');
const profesorController = require('../controllers/Profesor/profesorController');

// Ruta directa: /api/profesor/estudiantes
router.get('/estudiantes', verificarToken, profesorCtrl.obtenerEstudiantesAsignados);
router.get('/', profesorController.obtenerTodos);


module.exports = router;
