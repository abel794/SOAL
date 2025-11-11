// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

console.log('🔗 Rutas de autenticación cargadas');

// 🔐 Login
router.post('/login', authController.iniciarSesion);

// 🔓 Desbloqueo de cuenta
router.post('/solicitar-desbloqueo', authController.solicitarDesbloqueo);
router.post('/verificar-codigo', authController.verificarCodigoDesbloqueo);

// 📨 Olvido y restablecimiento de contraseña
router.post('/olvido-contrasena', authController.olvidoContrasena);
router.post('/restablecer-contrasena', authController.restablecerContrasena);

// 🚪 Cerrar sesión (Logout)
router.post('/logout', authController.cerrarSesion);

module.exports = router;
