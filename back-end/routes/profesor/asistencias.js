const express = require("express");
const router = express.Router();
const asistenciaController = require("../../controllers/Profesor/asistenciaController");

// Registrar
router.post("/", asistenciaController.registrar);

// Registrar masivo
router.post("/registro-masivo", asistenciaController.registrarMasivo);

// Obtener todas
router.get("/", asistenciaController.obtenerTodas);

// Obtener con filtros
router.get("/filtros", asistenciaController.obtenerConFiltros);

// Actualizar
router.put("/:id", asistenciaController.actualizar);

// Eliminar
router.delete("/:id", asistenciaController.eliminar);

module.exports = router;
