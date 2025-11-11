// routes/dashboardSecretaria.routes.js
const express = require('express');
const router = express.Router();

const dashboardSecretariaController = require('../controllers/Controlador_Secretaria/dashboardSecretariaController');

// Helper function to handle async routes
const asyncHandler = (controllerFunction) => (req, res) => {
  controllerFunction(req, res).catch((error) => {
    console.error("❌ Error:", error);
    res.status(500).json({ error: error.message || "Error interno del servidor" });
  });
};

console.log("router secretariaRoutes.js");

// Ruta para obtener el resumen
router.get("/resumen", asyncHandler(dashboardSecretariaController.obtenerResumen));

// Ruta para obtener los datos mensuales
router.get("/mensual", asyncHandler(dashboardSecretariaController.obtenerMensual));

// Ruta para obtener el estado de los formularios
router.get("/estado_formularios", asyncHandler(dashboardSecretariaController.obtenerEstadoFormularios));

//Ruta para obtener actividades recientes 
router.get("/recientes", asyncHandler(dashboardSecretariaController.obtenerRecientes))

module.exports = router;
