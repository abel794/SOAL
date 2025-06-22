const express = require('express');
const router = express.Router();
const controller = require('../controllers/secretariaController');

router.get('/', controller.obtenerTodas); // corregido aquí ✅
router.get('/:id', controller.obtenerPorId);
router.post('/', controller.crear);
router.put('/:id', controller.actualizar);
router.delete('/:id', controller.eliminar);

module.exports = router;
