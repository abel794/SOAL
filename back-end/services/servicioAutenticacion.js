const { Usuario } = require('../models');

class ServicioAutenticacion {
  async iniciarSesion(nombre_usuario, clave) {
    const usuario = await Usuario.findOne({ where: { nombre_usuario } });

    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    if (usuario.clave !== clave) {
      throw new Error('Contraseña incorrecta');
    }

    if (usuario.estado !== 'Activo') {
      throw new Error('El usuario está inactivo');
    }

    return {
      id_usuario: usuario.id_usuario,
      nombre_usuario: usuario.nombre_usuario,
      rol: usuario.tipo_usuario,
      estado: usuario.estado,
    };
  }
}

module.exports = new ServicioAutenticacion();


