const express = require('express');
const router = express.Router();
const controller = require('../../controllers/controlador_coordinador/justificacionController');
const multer = require('multer');
const { verificarToken, verificarRol } = require('../../middlewares/authMiddleware');

// 🧠 Configuración de multer en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage });

/* ===============================================
   📋 RUTAS DE JUSTIFICACIONES
   =============================================== */

// 🔍 Listar todas las justificaciones (Coordinador o Profesor)
router.get(
  '/',
  verificarToken,
  verificarRol(['Coordinador', 'Profesor']),
  controller.listarPorProfesor
);

// 🔍 Buscar justificaciones por estudiante
router.get(
  '/estudiante/:id',
  verificarToken,
  verificarRol(['Coordinador', 'Profesor']),
  controller.buscarPorEstudiante
);

// 📅 Buscar por fecha (opcional: ?desde=YYYY-MM-DD&hasta=YYYY-MM-DD)
router.get(
  '/buscar/fecha',
  verificarToken,
  verificarRol(['Coordinador', 'Profesor']),
  controller.buscarPorFecha
);

// ➕ Crear nueva justificación (solo Estudiantes)
router.post(
  '/',
  verificarToken,
  verificarRol(['Estudiante','Acudiente']),
  upload.single('archivo'),
  controller.crear
);

// 📥 Descargar archivo asociado
router.get(
  '/descargar/:id',
  verificarToken,
  verificarRol(['Acudiente','Coordinador', 'Profesor', 'Estudiante']),
  controller.descargar
);

// 👨‍👩‍👧 Listar justificaciones del acudiente autenticado
router.get(
  '/mis-justificaciones',
  verificarToken,
  verificarRol(['Acudiente']),
  controller.listarPorAcudiente
);
router.get('/descargar/:id', controller.descargarJustificacion);
router.get('/verificar-archivo/:id', controller.verArchivoBase64);

// 👨‍🏫 Listar justificaciones del grupo del profesor autenticado
router.get(
  '/justificaciones-grupo',
  verificarToken,
  verificarRol(['Profesor']),
  controller.listarPorProfesor
);

module.exports = router;
