const jwt = require('jsonwebtoken');
const servicioAutenticacion = require('../services/servicioAutenticacion');
require('dotenv').config(); // Carga las variables del .env

const authController = {
  async iniciarSesion(req, res) {
    try {
      const { username, contrasena } = req.body;

      const datosUsuario = await servicioAutenticacion.iniciarSesion(username, contrasena);

      // ✅ Crear el token JWT
      const token = jwt.sign(
        {
          id_usuario: datosUsuario.id_usuario,
          id_tipo_usuario: datosUsuario.id_tipo_usuario
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' } // o '2h', '24h' según necesites
      );

      // ✅ Enviar el token junto con los datos del usuario
      res.status(200).json({
        mensaje: 'Inicio de sesión exitoso',
        token, // <-- Aquí va el JWT
        usuario: datosUsuario
      });
    } catch (error) {
      res.status(401).json({ mensaje: error.message });
    }
  }
};

module.exports = authController;
