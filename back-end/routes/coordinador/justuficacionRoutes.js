
const express = require('express');
const router = express.Router();
const controller = require('../../controllers/controlador_coordinador/justificacionController');
const multer = require('multer');
const verificarToken = require('../../middlewares/verificarToken');


// 🧠 Configuración de multer para guardar en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage });

// 📅 Buscar por fecha (individual o rango: ?desde=2025-06-01&hasta=2025-06-29)
router.get('/buscar/fecha', (req, res, next) => {
  console.log('📅 [Ruta] Buscar por fecha');
  next();
}, controller.buscarPorFecha);

// 🔍 Buscar justificaciones por estudiante
router.get('/estudiante/:id', (req, res, next) => {
  console.log(`🔍 [Ruta] Buscar por estudiante ID: ${req.params.id}`);
  next();
}, controller.buscarPorEstudiante);

// 📋 Listar todas las justificaciones
router.get('/', (req, res, next) => {
  console.log('📋 [Ruta] Listar todas las justificaciones');
  next();
}, controller.listarTodas);

// ➕ Crear nueva justificación con archivo
router.post(
  '/',
  verificarToken, // ✅ Aplica el middleware aquí
  upload.single('archivo'),
  (req, res, next) => {
    console.log('➕ [Ruta] Crear nueva justificación');
    console.log('📦 Archivo recibido en ruta:', req.file?.originalname);
    next();
  },
  controller.crear
);

// 📥 Descargar archivo por ID
router.get('/descargar/:id', (req, res, next) => {
  console.log(`📥 [Ruta] Descargar archivo ID: ${req.params.id}`);
  next();
}, controller.descargar);

module.exports = router;
