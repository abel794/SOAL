const { Usuario } = require('../models');

class ServicioAutenticacion {
  async iniciarSesion(username, contrasena) {
    // Buscar usuario por nombre de usuario
    const usuario = await Usuario.findOne({ where: { username } });

    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    // Validar contraseña
    if (usuario.contrasena !== contrasena) {
      throw new Error('Contraseña incorrecta');
    }

    // Validar estado del usuario (activo normalmente es id_estado_usuario = 1)
    if (usuario.id_estado_usuario !== 1) {
      throw new Error('El usuario está inactivo');
    }

    // Retornar datos esenciales del usuario
    return {
      id_usuario: usuario.id_usuario,
      username: usuario.username,
      id_tipo_usuario: usuario.id_tipo_usuario,
      id_estado_usuario: usuario.id_estado_usuario,
    };
  }
}

module.exports = new ServicioAutenticacion();



