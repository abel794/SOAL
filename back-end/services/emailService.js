const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "renatodescartes26@gmail.com",
    pass: "qqmonevlttyaqjbk"
  }
});

async function enviarCorreo(destinatario, asunto, mensaje, archivo) {
  try {
    const mailOptions = {
      from: '"Instituto Renato Descartes" <renatodescartes26@gmail.com>',
      to: destinatario,
      subject: asunto,
      text: mensaje,
    };

    // Si hay archivo, lo agregamos como adjunto
    if (archivo) {
      mailOptions.attachments = [
        {
          filename: archivo.filename || "adjunto.pdf",
          // IMPORTANTE: Para buffers, usar 'content' directamente
          content: archivo.content,
          encoding: 'base64' // Asegurar que se trata como base64
        }
      ];
    }

    const info = await transporter.sendMail(mailOptions);
    console.log(`📨 Correo enviado a ${destinatario}:`, info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Error al enviar correo:", error);
    throw error;
  }
}

module.exports = { enviarCorreo };