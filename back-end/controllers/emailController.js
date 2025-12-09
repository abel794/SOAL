const { enviarCorreo } = require("../services/emailService");
const multer = require("multer");

// Configuración de multer para archivos en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage });

const emailController = {
  // Método original para FormData (multipart/form-data)
  enviar: async (req, res) => {
    try {
      // Si viene como FormData (archivo) o solo texto
      const destinatario = req.body.destinatario;
      const asunto = req.body.asunto;
      const mensaje = req.body.mensaje;
      const archivo = req.file; // multer lo guardará en req.file

      console.log("📨 Petición recibida en /enviar");
      console.log("Destinatario:", destinatario);
      console.log("Archivo recibido:", archivo ? "Sí" : "No");

      if (!destinatario || !asunto || !mensaje) {
        return res.status(400).json({ mensaje: "Faltan datos obligatorios" });
      }

      // Preparar el archivo si existe
      let archivoAdjunto = null;
      if (archivo) {
        archivoAdjunto = {
          filename: archivo.originalname || "adjunto.pdf",
          content: archivo.buffer
        };
        console.log("📎 Archivo preparado:", archivoAdjunto.filename);
      }

      await enviarCorreo(destinatario, asunto, mensaje, archivoAdjunto);
      res.status(200).json({ 
        mensaje: "Correo enviado correctamente 📨",
        archivoAdjunto: archivoAdjunto ? archivoAdjunto.filename : "Ninguno"
      });
    } catch (error) {
      console.error("❌ Error en enviar correo:", error);
      res.status(500).json({ 
        mensaje: "Error al enviar correo", 
        error: error.message 
      });
    }
  },

  // NUEVO MÉTODO para base64 (application/json)
  enviarBase64: async (req, res) => {
    try {
      console.log("📨 Petición recibida en /enviar-base64");
      console.log("Cuerpo completo recibido:", JSON.stringify(req.body, null, 2));

      const { destinatario, asunto, mensaje, pdfBase64, nombreArchivo } = req.body;

      console.log("Destinatario:", destinatario);
      console.log("Asunto:", asunto);
      console.log("Tamaño del mensaje:", mensaje?.length);
      console.log("pdfBase64 recibido:", pdfBase64 ? `Sí, longitud: ${pdfBase64.length}` : "No");

      if (!destinatario || !asunto || !mensaje) {
        return res.status(400).json({ 
          mensaje: "Faltan datos obligatorios: destinatario, asunto, mensaje" 
        });
      }

      let archivoAdjunto = null;
      if (pdfBase64) {
        // Verificar que el base64 sea válido
        if (!pdfBase64.startsWith('JVBER') && !pdfBase64.includes('/9j/')) {
          console.log("⚠️ El base64 no parece ser un PDF válido");
        }
        
        // Convertir base64 a buffer
        const buffer = Buffer.from(pdfBase64, 'base64');
        console.log("📦 Buffer creado, tamaño:", buffer.length, "bytes");
        
        archivoAdjunto = {
          filename: nombreArchivo || `observaciones_${Date.now()}.pdf`,
          content: buffer
        };
        
        console.log("📎 Archivo preparado:", archivoAdjunto.filename);
      }

      await enviarCorreo(destinatario, asunto, mensaje, archivoAdjunto);
      res.status(200).json({ 
        mensaje: "✅ Correo enviado correctamente desde base64",
        destinatario: destinatario,
        archivoAdjunto: archivoAdjunto ? archivoAdjunto.filename : "Ninguno",
        fecha: new Date().toISOString()
      });
    } catch (error) {
      console.error("❌ Error en enviarBase64:", error);
      console.error("Stack trace:", error.stack);
      res.status(500).json({ 
        mensaje: "Error al enviar correo desde base64", 
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }
};

module.exports = emailController;