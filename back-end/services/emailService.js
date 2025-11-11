// services/emailService.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "renatodescartes26@gmail.com",
    pass: "qqmonevlttyaqjbk" // tu contraseña de aplicación
  }
});

async function enviarCorreo(destinatario, asunto, mensaje) {
  try {
    const info = await transporter.sendMail({
      from: '"Instituto Renato Descartes" <renatodescartes26@gmail.com>',
      to: destinatario,
      subject: asunto,
      text: mensaje
    });
    console.log(`📨 Correo enviado a ${destinatario}:`, info.messageId);
  } catch (error) {
    console.error("❌ Error al enviar correo:", error);
  }
}

module.exports = { enviarCorreo };
