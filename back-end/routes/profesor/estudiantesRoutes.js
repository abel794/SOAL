const express = require('express');
const router = express.Router();
const { obtenerEstudiantesAsignados, obtenerGradosPorProfesor } = require('../../controllers/Profesor/estudiantesController');


router.get("/:idProfesor/grados", obtenerGradosPorProfesor);


router.get("/:id/estudiantes/:id_grado?", obtenerEstudiantesAsignados);

module.exports = router;
