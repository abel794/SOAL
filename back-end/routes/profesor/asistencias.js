const express = require("express");
const router = express.Router();
const asistenciaController = require("../../controllers/Profesor/asistenciaController");

// Registrar individual
router.post("/", asistenciaController.registrar);

// Registrar masivo
router.post("/registro-masivo", asistenciaController.registrarMasivo);

// Obtener todas
router.get("/", asistenciaController.obtenerTodas);

// Obtener con filtros
router.get("/filtros", asistenciaController.obtenerConFiltros);

// Historial por profesor
router.get("/historial/profesor/:id", asistenciaController.historialPorProfesor);

// Historial por estudiante
router.get("/historial/estudiante/:id", asistenciaController.historialPorEstudiante);

// Actualizar
router.put("/:id", asistenciaController.actualizar);

// Eliminar
router.delete("/:id", asistenciaController.eliminar);

module.exports = router;
