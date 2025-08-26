// back-end/controllers/authController.js
const { Usuario, Funcionario } = require('../models');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const authController = {
  async iniciarSesion(req, res) {
    try {
      const { usuario: username, contrasena } = req.body;

      // Buscar usuario junto con su relación a funcionario
      const usuarioDB = await Usuario.findOne({
        where: { username },
        include: { model: Funcionario, as: 'funcionario' }
      });

      if (!usuarioDB) return res.status(401).json({ mensaje: 'Usuario no encontrado' });

      if (usuarioDB.contrasena !== contrasena)
        return res.status(401).json({ mensaje: 'Contraseña incorrecta' });

      if (usuarioDB.id_estado_usuario !== 1)
        return res.status(401).json({ mensaje: 'Usuario inactivo' });

      // Verificar que tenga funcionario asociado
      if (!usuarioDB.funcionario) {
        return res.status(401).json({ mensaje: 'Usuario no es funcionario' });
      }

      // ✅ Generar token JWT con id_funcionario real
      const token = jwt.sign(
        {
          id_funcionario: usuarioDB.funcionario.id_funcionario,
          username: usuarioDB.username
        },
        process.env.JWT_SECRET || 'miclave123',
        { expiresIn: '1h' }
      );

      res.status(200).json({
        mensaje: 'Inicio de sesión exitoso',
        token,
        usuario: {
          id_usuario: usuarioDB.id_usuario,
          username: usuarioDB.username,
          id_tipo_usuario: usuarioDB.id_tipo_usuario,
          id_funcionario: usuarioDB.funcionario.id_funcionario
        }
      });

    } catch (error) {
      res.status(500).json({ mensaje: error.message });
    }
  },
};

module.exports = authController;
