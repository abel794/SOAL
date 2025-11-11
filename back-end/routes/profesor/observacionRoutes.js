// back-end/routes/profesor/observacionRoutes.js
const express = require("express");
const router = express.Router();
const { obtenerObservacionesPorEstudiante, crearObservacion } = require("../../controllers/Profesor/observacionController");

// Obtener observaciones de un estudiante
router.get("/:idEstudiante", obtenerObservacionesPorEstudiante);

// Crear observación nueva
router.post("/", crearObservacion);

module.exports = router;
