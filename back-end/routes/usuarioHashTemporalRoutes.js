// back-end/routes/usuarioHashTemporalRoutes.js
const express = require('express');
const router = express.Router();
const usuarioHashTemporalController = require('../controllers/usuarioHashTemporalController');

// POST http://localhost:3000/api/usuario/hash-temporal
router.post('/hash-temporal', usuarioHashTemporalController.hashear);

module.exports = router;
