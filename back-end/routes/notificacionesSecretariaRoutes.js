// back-end/routes/notificacionesSecretariaRoutes.js
const express = require("express");
const router = express.Router();
const SecretariaRutes = require("../controllers/Controlador_Secretaria/notificacionesSecretariaController");
const db = require("../models"); // intenta cargar modelos Sequelize si existen

console.log('router notificacionesSecretariaRoutes.js cargado');

// Debug local: ver cada petición que entra a este router
router.use((req, res, next) => {
  console.log(`[NOTIF-ROUTER] ${new Date().toISOString()} ${req.method} ${req.originalUrl}`);
  next();
});

// POST /  -> crear notificación (tu controlador ya maneja res)
router.post("/", async (req, res) => {
  try {
    console.log("💬 Recibiendo solicitud para crear notificación...");
    await SecretariaRutes.crearNotificacion(req, res);
    console.log("✅ Notificación creada con éxito");
  } catch (error) {
    console.error("❌ Error al crear notificación:", error);
    res.status(500).json({ error: "Error al crear la notificación" });
  }
});

// GET / -> obtener historial (tu controlador ya maneja res)
router.get("/", async (req, res) => {
  try {
    console.log("💬 Recibiendo solicitud para obtener historial de notificaciones...");
    await SecretariaRutes.obtenerNotificaciones(req, res);
    console.log("✅ Historial de notificaciones obtenido con éxito");
  } catch (error) {
    console.error("❌ Error al obtener historial de notificaciones:", error);
    res.status(500).json({ error: "Error al obtener el historial de notificaciones" });
  }
});

// NEW: GET /count -> devuelve la cantidad de notificaciones
router.get("/count", async (req, res) => {
  try {
    console.log("💬 GET /count solicitado");

    // 1) Si el controlador tiene un método para contar, úsalo
    if (typeof SecretariaRutes.contarNotificaciones === "function") {
      const result = await SecretariaRutes.contarNotificaciones(req, res);
      if (res.headersSent) return; // si el controlador ya respondió
      // si el controlador devolvió el número
      if (typeof result === "number") return res.json({ count: result });
    }

    // 2) Intentar usar modelos Sequelize comunes (Notificaciones, Notificacion, ...)
    const possibleModels = ['Notificaciones', 'Notificacion', 'NotificacionesSecretaria', 'NotificacionSecretaria'];
    let Model = null;
    for (const name of possibleModels) {
      if (db && db[name]) { Model = db[name]; break; }
    }

    if (Model && typeof Model.count === "function") {
      const count = await Model.count();
      return res.json({ count });
    }

    // 3) Fallback: llamar al obtenerNotificaciones y medir longitud de la respuesta
    if (typeof SecretariaRutes.obtenerNotificaciones === "function") {
      // Capturamos la respuesta del controlador si este devuelve el array directamente.
      const fakeRes = {
        jsonPayload: null,
        status() { return this; },
        json(obj) { this.jsonPayload = obj; },
        send(obj) { this.jsonPayload = obj; }
      };
      await SecretariaRutes.obtenerNotificaciones(req, fakeRes);
      const data = fakeRes.jsonPayload;
      // intentar deducir length
      if (Array.isArray(data)) return res.json({ count: data.length });
      if (data && Array.isArray(data.rows)) return res.json({ count: data.rows.length });
    }

    // 4) Si nada se encontró, devolver 0 y avisar en logs
    console.warn('No se encontró método o modelo para contar notificaciones. Devuelto count:0');
    return res.json({ count: 0 });

  } catch (error) {
    console.error("❌ Error en /count:", error);
    return res.status(500).json({ error: "Error interno al contar notificaciones" });
  }
});

module.exports = router;
