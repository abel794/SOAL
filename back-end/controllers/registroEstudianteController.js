const db = require('../models');
const { Persona, Usuario, Estudiante, sequelize } = db;

const registrarEstudianteCompleto = {

  async registrarTodo(req, res) {
    const t = await sequelize.transaction(); // 👉 Transacción para asegurar integridad

    try {
      const numeroDoc = req.body.numero_documento;

      // Verificar si ya existe la Persona
      const personaExistente = await Persona.findOne({ where: { numero_documento: numeroDoc } });
      if (personaExistente) {
        return res.status(400).json({ mensaje: 'El número de documento ya existe en Persona' });
      }

      // Verificar si el username ya está usado
      const usernameExistente = await Usuario.findOne({ where: { username: req.body.username } });
      if (usernameExistente) {
        return res.status(400).json({ mensaje: 'El nombre de usuario ya está en uso' });
      }

      // Verificar si ya existe el documento en Usuario
      const usuarioDocExistente = await Usuario.findOne({ where: { numero_documento: numeroDoc } });
      if (usuarioDocExistente) {
        return res.status(400).json({ mensaje: 'Ese número de documento ya está asociado a un Usuario' });
      }

      // Verificar si ya existe el estudiante
      const estudianteExistente = await Estudiante.findOne({ where: { numero_documento: numeroDoc } });
      if (estudianteExistente) {
        return res.status(400).json({ mensaje: 'Ese número de documento ya pertenece a un Estudiante' });
      }

      // Crear Persona
      const persona = await Persona.create({
        numero_documento: numeroDoc,
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        correo: req.body.correo,
        telefono: req.body.telefono,
        direccion: req.body.direccion,
        ciudad_residencia: req.body.ciudad_residencia,
        tipo_sangre: req.body.tipo_sangre,
        discapacidad: req.body.discapacidad,
        ocupacion: req.body.ocupacion,
        fecha_nacimiento: req.body.fecha_nacimiento,
        foto: req.body.foto,
        id_sexo: req.body.id_sexo,
        id_tipo_documento: req.body.id_tipo_documento
      }, { transaction: t });

      // Crear Usuario
      const usuario = await Usuario.create({
        username: req.body.username,
        contrasena: req.body.contrasena,
        numero_documento: numeroDoc,
        id_tipo_usuario: req.body.id_tipo_usuario,
        id_estado_usuario: req.body.id_estado_usuario
      }, { transaction: t });

      // Crear Estudiante
      const estudiante = await Estudiante.create({
        numero_documento: numeroDoc,
        id_usuario: usuario.id_usuario,
        id_eps: req.body.id_eps,
        id_estado_academico: req.body.id_estado_academico,
        id_acudiente: req.body.id_acudiente
      }, { transaction: t });

      await t.commit();

      res.status(201).json({
        mensaje: 'Estudiante registrado exitosamente',
        persona,
        usuario,
        estudiante
      });

    } catch (error) {
      await t.rollback();
      console.error(error);
      res.status(500).json({ mensaje: 'Error al registrar el estudiante', error });
    }
  }

};

module.exports = registrarEstudianteCompleto;
