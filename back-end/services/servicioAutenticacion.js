const { Usuario, Funcionario } = require('../models');

class ServicioAutenticacion {
  async iniciarSesion(username, contrasena) {
    // Buscar usuario incluyendo la relación con funcionario
    const usuario = await Usuario.findOne({
      where: { username },
      include: [
        {
          model: Funcionario,
          as: 'funcionario', // este alias debe coincidir con el modelo
          attributes: ['id_funcionario']
        }
      ]
    });

    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    // Validar contraseña sin cifrado (como estás usando)
    if (usuario.contrasena !== contrasena) {
      throw new Error('Contraseña incorrecta');
    }

    if (usuario.id_estado_usuario !== 1) {
      throw new Error('El usuario está inactivo');
    }

    const datos = usuario.toJSON();

    // Agregar id_funcionario si existe
    const idFuncionario = datos.funcionario?.id_funcionario || null;

    return {
      id_usuario: datos.id_usuario,
      username: datos.username,
      id_tipo_usuario: datos.id_tipo_usuario,
      id_estado_usuario: datos.id_estado_usuario,
      id_funcionario: idFuncionario // aquí va el que necesitabas
    };
  }
}

module.exports = new ServicioAutenticacion();
