const express = require('express');
const router = express.Router();
const controller = require('../controllers/categoriaObservacionController');

router.get('/', controller.obtenerTodas);
router.post('/', controller.crear);

module.exports = router;