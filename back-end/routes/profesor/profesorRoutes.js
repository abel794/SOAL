// routes/profesorRoutes.js
const express = require("express");
const router = express.Router();

// Importar controlador de estudiantes
const EstudianteController = require("../../controllers/Profesor/estudiantesController");


// Importar subrutas
const estudiantesRoutes = require("./estudiantesRoutes");


// Montar subrutas con prefijos
router.use("/estudiantes", estudiantesRoutes);


// Ruta principal para obtener estudiantes asignados a un profesor
// Ejemplo de uso: GET /api/profesor/1
router.get("/:id", EstudianteController.obtenerEstudiantesAsignados);

module.exports = router;
