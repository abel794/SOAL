const express = require('express');
const router = express.Router();
const observacionCtrl = require('../../controllers/profesor/observacionController');

// Listar observaciones del profesor
router.get('/', observacionCtrl.listar);

// Crear nueva observación
router.post('/', observacionCtrl.crear);

// Actualizar observación
router.put('/:id', observacionCtrl.actualizar);

// Eliminar observación
router.delete('/:id', observacionCtrl.eliminar);

module.exports = router;
