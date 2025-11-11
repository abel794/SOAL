const express = require('express');
const router = express.Router();
const controller = require('../../controllers/controlador_coordinador/estudianteController');
const authMiddleware = require('../../middlewares/verificarToken');

// Listar todos los estudiantes
router.get('/', authMiddleware, (req, res, next) => {
  console.log('📌 Ruta llamada: GET /api/coordinador/estudiante');
  next();
}, controller.listarTodos);

// Buscar estudiantes por nombre o documento
router.get('/buscar', authMiddleware, (req, res, next) => {
  console.log('📌 Ruta llamada: GET /api/coordinador/estudiante/buscar');
  console.log('Query recibida:', req.query);
  next();
}, controller.buscar);

// Contar estudiantes
router.get('/total', authMiddleware, (req, res, next) => {
  console.log('📌 Ruta llamada: GET /api/coordinador/estudiante/total');
  next();
}, controller.contar);

// Obtener un estudiante por ID
router.get('/:id', authMiddleware, (req, res, next) => {
  console.log(`📌 Ruta llamada: GET /api/coordinador/estudiante/${req.params.id}`);
  next();
}, controller.obtenerPorId);

// Crear un estudiante
router.post('/', authMiddleware, (req, res, next) => {
  console.log('📌 Ruta llamada: POST /api/coordinador/estudiante');
  console.log('Body recibido:', req.body);
  next();
}, controller.crear);

// Actualizar estudiante por ID
router.put('/:id', authMiddleware, (req, res, next) => {
  console.log(`📌 Ruta llamada: PUT /api/coordinador/estudiante/${req.params.id}`);
  console.log('Body recibido:', req.body);
  next();
}, controller.actualizar);

// Eliminar estudiante por ID
router.delete('/:id', authMiddleware, (req, res, next) => {
  console.log(`📌 Ruta llamada: DELETE /api/coordinador/estudiante/${req.params.id}`);
  next();
}, controller.eliminar);

module.exports = router;
