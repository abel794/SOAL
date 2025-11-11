const express = require('express');
const router = express.Router();
const controladorAutenticacion = require('../controllers/controladorAutenticacion');

// Ruta: POST /api/autenticacion/iniciar-sesion
router.post('/iniciar-sesion', controladorAutenticacion.iniciarSesion);

module.exports = router;
