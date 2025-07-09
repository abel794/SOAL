const express = require('express');
const router = express.Router();
const controlador = require('../controllers/configuracionSistemaController');
const permisos = require('../middlewares/permisosConfiguracion');

// Opcional: middleware de autenticación si ya lo usas
const verificarToken = require('../middlewares/verificarToken');

// Multer si se sube logo
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

router.get('/', verificarToken, controlador.obtener);
router.put('/', verificarToken, permisos, upload.single('logo'), controlador.actualizar);

module.exports = router;
