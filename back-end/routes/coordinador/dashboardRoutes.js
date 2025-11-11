// 📂 routes/coordinador/dashboardRoutes.js
const express = require('express');
const router = express.Router();
const dashboardController = require('../../controllers/controlador_coordinador/dashboardController.js');

// 👨‍🏫 Profesores activos
router.get('/profesores/activos', async (req, res) => {
  try {
    console.log('📊 Ruta GET /api/coordinador/dashboard/profesores/activos');
    await dashboardController.profesoresActivos(req, res);
  } catch (error) {
    console.error('❌ Error en /profesores/activos:', error);
    res.status(500).json({ error: 'Error en la ruta /profesores/activos', detalle: error.message });
  }
});

// 📨 PQR pendientes
router.get('/pqrs/SinResponder', async (req, res) => {
  try {
    console.log('📊 Ruta GET /api/coordinador/dashboard/pqrs/SinResponder');
    await dashboardController.pqrPendientes(req, res);
  } catch (error) {
    console.error('❌ Error en /pqrs/SinResponder:', error);
    res.status(500).json({ error: 'Error en la ruta /pqrs/SinResponder', detalle: error.message });
  }
});

// 🔔 Notificaciones enviadas
router.get('/notificaciones/enviadas', async (req, res) => {
  try {
    console.log('📊 Ruta GET /api/coordinador/dashboard/notificaciones/enviadas');
    await dashboardController.notificacionesEnviadas(req, res);
  } catch (error) {
    console.error('❌ Error en /notificaciones/enviadas:', error);
    res.status(500).json({ error: 'Error en la ruta /notificaciones/enviadas', detalle: error.message });
  }
});

// 🎓 Estudiantes matriculados
router.get('/estudiantes/matriculados', async (req, res) => {
  try {
    console.log('📊 Ruta GET /api/coordinador/dashboard/estudiantes/matriculados');
    await dashboardController.estudiantesMatriculados(req, res);
  } catch (error) {
    console.error('❌ Error en /estudiantes/matriculados:', error);
    res.status(500).json({ error: 'Error en la ruta /estudiantes/matriculados', detalle: error.message });
  }
});

// 🗓️ Asistencias registradas (todos)
router.get('/asistencias/registradas', async (req, res) => {
  try {
    console.log('📊 Ruta GET /api/coordinador/dashboard/asistencias/registradas');
    await dashboardController.asistenciasRegistradas(req, res);
  } catch (error) {
    console.error('❌ Error en /asistencias/registradas:', error);
    res.status(500).json({ error: 'Error en la ruta /asistencias/registradas', detalle: error.message });
  }
});

// 🛑 Asistencias registradas (faltas)
router.get('/asistencias/registradasfaltas', async (req, res) => {
  try {
    console.log('📊 Ruta GET /api/coordinador/dashboard/asistencias/registradasfaltas');
    await dashboardController.asistenciasRegistradasfaltas(req, res);
  } catch (error) {
    console.error('❌ Error en /asistencias/registradasfaltas:', error);
    res.status(500).json({ error: 'Error en la ruta /asistencias/registradasfaltas', detalle: error.message });
  }
});

// 🧾 Observaciones por gravedad (resumen por grado)
router.get('/observacionesGrado', async (req, res) => {
  try {
    console.log('📊 Ruta GET /api/coordinador/dashboard/observacionesGrado');
    // En el controller tu método se llama observacionesPorGravedad
    await dashboardController.observacionesPorGravedad(req, res);
  } catch (error) {
    console.error('❌ Error en /observacionesGrado:', error);
    res.status(500).json({ error: 'Error en la ruta /observacionesGrado', detalle: error.message });
  }
});

module.exports = router;
