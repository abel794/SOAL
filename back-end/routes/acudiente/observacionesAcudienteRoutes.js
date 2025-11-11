// routes/acudiente/observacionesRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../../controllers/controlador_acudiente/observaciones_acudiente');
const { verificarToken, verificarRol } = require('../../middlewares/authMiddleware');

// ✅ Todas las rutas protegidas para rol Acudiente
router.use(verificarToken, verificarRol(['Acudiente']));

// 📌 Obtener todas las observaciones de los estudiantes a cargo del acudiente autenticado
router.get('/', async (req, res) => {
  try {
    console.log('[GET] /api/acudientes/observaciones');
    console.log('Token decodificado:', req.usuario); // Viene del middleware

    await controller.obtenerPorAcudiente(req, res);
  } catch (error) {
    console.error('❌ Error en GET /observaciones (por acudiente):', error);
    res.status(500).json({ message: 'Error interno al obtener observaciones del acudiente.' });
  }
});

// 📌 Obtener observaciones de un estudiante específico (por ID)
router.get('/:idEstudiante', async (req, res) => {
  try {
    const { idEstudiante } = req.params;
    console.log(`[GET] /api/acudientes/observaciones/${idEstudiante}`);
    console.log('Params recibidos:', req.params);

    await controller.obtenerPorEstudiante(req, res);
  } catch (error) {
    console.error('❌ Error en GET /observaciones/:idEstudiante:', error);
    res.status(500).json({ message: 'Error interno al obtener observaciones del estudiante.' });
  }
});

module.exports = router;
