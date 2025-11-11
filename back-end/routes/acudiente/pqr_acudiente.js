// routes/acudiente/pqr_acudiente.js
const express = require('express');
const router = express.Router();

const pqrAcudienteController = require('../../controllers/controlador_acudiente/pqracudiente');
const historialPqrAcudiente = require('../../controllers/controlador_acudiente/historial_pqr_acudiendte');
const { verificarToken, verificarRol } = require('../../middlewares/authMiddleware');

// ✅ Todas las rutas protegidas por token y rol Acudiente
router.use(verificarToken, verificarRol(['Acudiente']));

/* ----------------------------------------------
📌 Crear un nuevo PQR (acudiente logueado)
----------------------------------------------- */
router.post('/', async (req, res) => {
  try {
    console.log('[PQR][POST] Creando nuevo PQR...');
    await pqrAcudienteController.crear(req, res);
  } catch (error) {
    console.error('[PQR][POST] Error al crear PQR:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor al crear PQR' });
  }
});

/* ----------------------------------------------
🔍 Listar PQRs del acudiente logueado
----------------------------------------------- */
router.get('/mis-pqrs', async (req, res) => {
  try {
    console.log('[PQR][GET] Listando PQRs del acudiente logueado...');
    await pqrAcudienteController.listarMisPQR(req, res);
  } catch (error) {
    console.error('[PQR][GET] Error al listar PQRs del acudiente:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor al listar PQRs' });
  }
});

/* ----------------------------------------------
📜 Historial de un PQR específico (por ID)
----------------------------------------------- */
router.get('/:id/historial', async (req, res) => {
  try {
    console.log(`[PQR][GET] Historial del PQR con ID: ${req.params.id}`);
    await historialPqrAcudiente.listarHistorial(req, res);
  } catch (error) {
    console.error(`[PQR][GET] Error al obtener historial del PQR ${req.params.id}:`, error);
    res.status(500).json({ mensaje: 'Error interno del servidor al obtener historial del PQR' });
  }
});

module.exports = router;
