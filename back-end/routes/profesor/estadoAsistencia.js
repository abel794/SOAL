// routes/estadoAsistencia.js
const express = require("express");
const router = express.Router();
const estadoAsistenciaController = require("../../controllers/estadoAsistenciaController");


// Obtener todos los estados
router.get("/", estadoAsistenciaController.obtenerTodos);

// Crear, actualizar, eliminar si quieres más adelante
router.post("/", estadoAsistenciaController.crear);
router.put("/:id", estadoAsistenciaController.actualizar);
router.delete("/:id", estadoAsistenciaController.eliminar);

module.exports = router;
