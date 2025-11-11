// routes/controlador_coordinador/observacionRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../../controllers/controlador_coordinador/observacionController');
const { verificarToken, verificarRol } = require('../../middlewares/authMiddleware');

// Estadísticas (públicas o internas según decisiones)
router.get('/contar', controller.contarObservaciones);
router.get('/contar/categoria', controller.contarPorCategoriaConPorcentaje);
router.get('/contar/gravedad', controller.contarPorGravedad);
router.get('/contar/tipo', controller.contarPorTipo);
//router.get('/contar/criticas', controller.contarCriticos);
//router.get('/criticas', controller.listarCriticos);

// CRUD protegido (sólo roles autorizados)
const ROLES_AUTORIZADOS = ['Coordinador', 'Profesor', 'Secretaria', 'Rector', 'Orientador'];

router.get('/detalles', verificarToken, verificarRol(ROLES_AUTORIZADOS), controller.listarConDetalles);
router.post('/', verificarToken, verificarRol(ROLES_AUTORIZADOS), controller.crear);
router.put('/:id', verificarToken, verificarRol(ROLES_AUTORIZADOS), controller.actualizar);
router.delete('/:id', verificarToken, verificarRol(ROLES_AUTORIZADOS), controller.eliminar);

module.exports = router;
