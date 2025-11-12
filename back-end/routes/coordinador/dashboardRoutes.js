// 📂 routes/coordinador/dashboardRoutes.js
const express = require('express');
const router = express.Router();
const dashboardController = require('../../controllers/controlador_coordinador/dashboardController.js');
// 📦 Permite usar fetch en Node.js
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));


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
// 💬 Frase del día (proxy para evitar CORS)
// 💬 Frase del día (proxy para evitar CORS y errores HTML)
router.get('/fraseDelDia', async (req, res) => {
  try {
    console.log('💡 Ruta GET /api/coordinador/dashboard/fraseDelDia');

    const respuesta = await fetch('https://frasedeldia.azurewebsites.net/api/phrase', {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0', // 👈 evita que Azure devuelva HTML
      },
    });

    const texto = await respuesta.text(); // leemos el texto crudo (puede ser JSON o HTML)
    console.log('📩 Respuesta cruda de Azure:', texto.slice(0, 200)); // imprime los primeros 200 caracteres

    let data;
    try {
      data = JSON.parse(texto); // intentamos parsear el JSON
    } catch (error) {
      console.error('⚠️ La respuesta NO era JSON válido. Posible HTML devuelto.');
      return res.status(502).json({
        error: 'La API no devolvió un JSON válido',
        detalle: texto.slice(0, 200), // enviamos parte del HTML como pista
      });
    }

    // Si todo bien, respondemos al frontend
    res.json({
      frase: data.phrase,
      autor: data.author,
      fuente: 'frasedeldia.azurewebsites.net',
    });

  } catch (error) {
    console.error('❌ Error al obtener la frase del día:', error);
    res.status(500).json({
      error: 'No se pudo obtener la frase del día',
      detalle: error.message,
    });
  }
});





module.exports = router;
