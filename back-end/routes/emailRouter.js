const express = require("express");
const router = express.Router();
const emailController = require("../controllers/emailController");
const multer = require("multer");

// Configuración de multer para archivos en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Ruta para FormData (multipart/form-data)
router.post("/enviar", upload.single("pdf"), emailController.enviar);

// Ruta para JSON con base64 (application/json)
router.post("/enviar-base64", emailController.enviarBase64);

// Ruta de prueba
router.get("/test", (req, res) => {
  res.json({ 
    mensaje: 'Servidor de correos funcionando ✅',
    fecha: new Date().toISOString(),
    endpoints: [
      '/api/email/enviar (POST) - Enviar con archivo multipart',
      '/api/email/enviar-base64 (POST) - Enviar con base64',
      '/api/email/test (GET) - Probar conexión'
    ]
  });
});

module.exports = router;