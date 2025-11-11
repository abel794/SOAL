const express = require('express');
const router = express.Router();
const { verificarToken } = require('../../middlewares/authMiddleware');
const notificacionesController = require('../../controllers/controlador_acudiente/notificacionesAcudiente');

// 📬 Listar todas (solo del acudiente logueado)
router.get('/', verificarToken, notificacionesController.listar);

// ✉️ Marcar una como leída
router.put('/:id/leida', verificarToken, notificacionesController.marcarLeida);

// ✅ Marcar varias
router.put('/marcar-varias', verificarToken, notificacionesController.marcarVarias);

// 🔢 Contar no leídas (solo del acudiente logueado)
router.get('/contador', verificarToken, notificacionesController.contarNoLeidas);

module.exports = router;
