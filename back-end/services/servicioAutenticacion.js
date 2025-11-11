// Importamos los modelos necesarios desde Sequelize
const { Usuario, Funcionario, Persona } = require('../models');
// Importamos bcrypt para comparar contraseñas encriptadas
const bcrypt = require('bcrypt');

class ServicioAutenticacion {
  // Método para iniciar sesión
  async iniciarSesion(username, contrasena) {
    // 🔍 Buscar usuario en la base de datos por su username
    // Incluye información de la Persona (nombre, apellido)
    // y del Funcionario (id_funcionario)
    const usuario = await Usuario.findOne({
      where: { username },
      attributes: [
        'id_usuario',
        'username',
        'contrasena',        // Se necesita para validar
        'id_tipo_usuario',
        'id_estado_usuario', // Validamos si está activo
        'numero_documento'
      ],
      include: [
        {
          model: Persona,
          as: 'persona',
          attributes: ['nombre', 'apellido'] // 👈 Solo datos básicos de la persona
        },
        {
          model: Funcionario,
          as: 'funcionario',
          attributes: ['id_funcionario'] // 👈 Solo el ID del funcionario
        }
      ]
    });

    // ⚠️ Si no se encuentra el usuario
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    // 🔑 Validar que la contraseña ingresada coincida
    // con el hash almacenado en la base de datos
    const coincide = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!coincide) {
      throw new Error('Contraseña incorrecta');
    }

    // 🚫 Verificar si el usuario está inactivo
    // (por ejemplo, estado diferente de 1 = inactivo)
    if (usuario.id_estado_usuario !== 1) {
      throw new Error('El usuario está inactivo');
    }

    // Convertimos el usuario a JSON para acceder a sus datos
    const datos = usuario.toJSON();

    // Si el usuario es funcionario, obtenemos su id_funcionario
    const idFuncionario = datos.funcionario?.id_funcionario || null;

    // ✅ Retornamos la información que se usará en el login
    return {
      id_usuario: datos.id_usuario,
      username: datos.username,
      numero_documento: datos.numero_documento,
      nombre: datos.persona?.nombre || null,    // Nombre de la persona
      apellido: datos.persona?.apellido || null, // Apellido de la persona
      id_tipo_usuario: datos.id_tipo_usuario,
      id_estado_usuario: datos.id_estado_usuario,
      id_funcionario: idFuncionario
    };
  }
}

// Exportamos una instancia de este servicio
module.exports = new ServicioAutenticacion();
