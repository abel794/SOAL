const servicioAutenticacion = require('../services/servicioAutenticacion');

const ControladorAutenticacion = {
  async iniciarSesion(req, res) {
    const { nombre_usuario, clave } = req.body;

    try {
      const usuario = await servicioAutenticacion.iniciarSesion(nombre_usuario, clave);
      res.json({ mensaje: 'Inicio de sesión exitoso', usuario });
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }
};

module.exports = ControladorAutenticacion;
