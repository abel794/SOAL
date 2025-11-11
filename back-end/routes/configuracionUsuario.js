// routes/configuracionUsuario.js
const express = require("express");
const router = express.Router();

// 🔑 Importar las funciones del controlador
const {
  obtenerConfiguracion,
  actualizarConfiguracion,
} = require("../controllers/configuracionUsuarioController");

// ✅ Ruta para obtener la configuración de un usuario
router.get("/:id_usuario", obtenerConfiguracion);

// ✅ Ruta para actualizar la configuración de un usuario
router.put("/:id_usuario", actualizarConfiguracion);

module.exports = router;
