const express = require("express");
const router = express.Router();

// Importar controladores directos
const EstudianteController = require("../../controllers/Profesor/estudiantesController");
const { obtenerPorId } = require("../../controllers/Profesor/profesorController");

// Importar subrutas
const asistenciaRoutes = require("./asistencias");
const observacionRoutes = require("./observacionRoutes");

// 👉 Rutas propias del profesor
router.get("/:id/datos", obtenerPorId);
router.get("/:id/estudiantes", EstudianteController.obtenerEstudiantesAsignados);

// 👉 Subrutas (quedan anidadas bajo /api/profesor/)
router.use("/asistencias", asistenciaRoutes);
router.use("/observaciones", observacionRoutes);

module.exports = router;
