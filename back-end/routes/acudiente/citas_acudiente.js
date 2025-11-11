const express = require('express');
const router = express.Router();

// ✅ Import correcto: controlador de CITAS (no el de PQR)
const citaController = require('../../controllers/controlador_acudiente/citas_acudiente');
const { verificarToken, verificarRol } = require('../../middlewares/authMiddleware');

// ✅ Todas requieren token y rol Acudiente
router.use(verificarToken, verificarRol(['Acudiente']));

// ✅ Citas del acudiente logueado (usa el token)
router.get('/', async (req, res) => {
  try {
    console.log('[GET] /api/acudientes/citas');
    console.log('Token decodificado:', req.usuario); // viene del middleware

    await citaController.obtenerPorToken(req, res);
  } catch (error) {
    console.error('❌ Error en ruta GET / (obtener citas por token):', error);
    res.status(500).json({ message: 'Error interno al obtener citas del acudiente logueado.' });
  }
});

// ✅ Citas de un acudiente específico por ID (parámetro)
router.get('/:id_acudiente', async (req, res) => {
  try {
    const { id_acudiente } = req.params;
    console.log(`[GET] /api/acudientes/citas/${id_acudiente}`);
    console.log('Params recibidos:', req.params);

    await citaController.obtenerPorId(req, res);
  } catch (error) {
    console.error('❌ Error en ruta GET /:id_acudiente (obtener citas por ID):', error);
    res.status(500).json({ message: 'Error interno al obtener citas por ID de acudiente.' });
  }
});

module.exports = router;
