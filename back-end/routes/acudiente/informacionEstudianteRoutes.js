const express = require("express");
const router = express.Router();
const { verificarToken, verificarRol } = require("../../middlewares/authMiddleware");
const {
  obtenerEstudiantesPorToken,
  obtenerEstudiantesPorId,
} = require("../../controllers/controlador_acudiente/informacion_estudiante_acudiente");

// ✅ Todas las rutas requieren token + rol Acudiente
router.use(verificarToken, verificarRol(["Acudiente"]));

// ✅ Estudiantes del acudiente logueado
router.get("/estudiantes", async (req, res) => {
  try {
    //console.log("[GET] /api/acudientes/informacion/estudiantes");
    //console.log("Token decodificado:", req.usuario); // req.user viene del middleware de token

    await obtenerEstudiantesPorToken(req, res);
  } catch (error) {
    console.error("❌ Error en ruta /estudiantes:", error);
    res.status(500).json({ message: "Error interno al obtener estudiantes por token" });
  }
});

// ✅ Estudiantes de un acudiente específico por ID
router.get("/:idAcudiente/estudiantes", async (req, res) => {
  try {
    const { idAcudiente } = req.params;
    //console.log(`[GET] /api/acudientes/informacion/${idAcudiente}/estudiantes`);
    //console.log("Params recibidos:", req.params);

    await obtenerEstudiantesPorId(req, res);
  } catch (error) {
    console.error("❌ Error en ruta /:idAcudiente/estudiantes:", error);
    res.status(500).json({ message: "Error interno al obtener estudiantes por ID" });
  }
});

module.exports = router;

