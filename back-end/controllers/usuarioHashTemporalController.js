// back-end/controllers/usuarioHashTemporalController.js
const bcrypt = require('bcrypt');
const db = require('../models');
const Usuario = db.Usuario;

const usuarioHashTemporalController = {
  // 🔹 Hashear contraseña de un usuario específico
  async hashear(req, res) {
    try {
      const { id_usuario, contrasena } = req.body;

      if (!id_usuario || !contrasena) {
        return res.status(400).json({ mensaje: 'Faltan datos: id_usuario o contrasena' });
      }

      const hash = await bcrypt.hash(contrasena, 10);

      await Usuario.update(
        { contrasena: hash },
        { where: { id_usuario } }
      );

      res.json({ mensaje: `✅ Contraseña del usuario ${id_usuario} hasheada con éxito` });
    } catch (error) {
      console.error('❌ Error hasheando contraseña:', error);
      res.status(500).json({ mensaje: 'Error al hashear contraseña' });
    }
  }
};

module.exports = usuarioHashTemporalController;
