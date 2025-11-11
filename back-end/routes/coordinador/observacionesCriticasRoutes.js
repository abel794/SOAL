// routes/observacionRoutes.js
const express = require('express');
const router = express.Router();
const observacionController = require('../../controllers/controlador_coordinador/observacionController');

// 🟢 Contar observaciones serias (Disciplina + Crítica/Grave/Urgente)
router.get('/observaciones/serias/contar', observacionController.contarObservacionesSerias);

// 🟢 Listar observaciones serias (Disciplina + Crítica/Grave/Urgente)
router.get('/observaciones/serias/listar', observacionController.listarObservacionesSerias);

module.exports = router;
