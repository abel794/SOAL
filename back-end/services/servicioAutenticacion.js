// back-end/controllers/servicioAutenticacion.js
const { Usuario } = require('../models');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const authController = {
  async iniciarSesion(req, res) {
    try {
      const { username, contrasena } = req.body;

      // Buscar usuario por username
      const usuario = await Usuario.findOne({ where: { username } });
      if (!usuario) {
        return res.status(401).json({ mensaje: 'Usuario no encontrado' });
      }

      // Validar contraseña (quitar esta línea si quieres ignorarla para pruebas)
      if (usuario.contrasena !== contrasena) {
        return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
      }

      // Verificar que esté activo
      if (usuario.id_estado_usuario !== 1) {
        return res.status(401).json({ mensaje: 'Usuario inactivo' });
      }

      // ✅ Generar token JWT
      const token = jwt.sign(
        { id_usuario: usuario.id_usuario, username: usuario.username }, // payload
        process.env.JWT_SECRET || 'miclave123', // tu clave secreta
        { expiresIn: '1h' } // duración del token
      );

      // Enviar datos y token
      res.status(200).json({
        mensaje: 'Inicio de sesión exitoso',
        token,
        usuario: {
          id_usuario: usuario.id_usuario,
          username: usuario.username,
          id_tipo_usuario: usuario.id_tipo_usuario
        }
      });
    } catch (error) {
      res.status(500).json({ mensaje: error.message });
    }
  },
};

module.exports = authController;
