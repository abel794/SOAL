const servicioAutenticacion = require('../services/servicioAutenticacion');

const authController = {
  async iniciarSesion(req, res) {
    try {
      const { username, contrasena } = req.body;

      const datosUsuario = await servicioAutenticacion.iniciarSesion(username, contrasena);

      res.status(200).json({ mensaje: 'Inicio de sesión exitoso', usuario: datosUsuario });
    } catch (error) {
      res.status(401).json({ mensaje: error.message });
    }
  }
};

module.exports = authController;
