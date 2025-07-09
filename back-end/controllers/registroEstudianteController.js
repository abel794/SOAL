const fs = require('fs');
const {
  Persona,
  Usuario,
  Estudiante,
  Acudiente,
  Archivo,
  sequelize
} = require('../models');

const registrarEstudianteCompleto = {
  async registrarTodo(req, res) {
    const t = await sequelize.transaction();

    try {
      const { estudiante, acudiente } = JSON.parse(req.body.formulario);

      const foto = req.files['foto']?.[0];
      const documento = req.files['documento']?.[0];

      if (!foto || !documento) {
        return res.status(400).json({ mensaje: 'Faltan archivos requeridos (foto o documento)' });
      }

      const numeroDocEst = estudiante.numero_documento;
      const numeroDocAcu = acudiente.numero_documento;

      const personaExistente = await Persona.findOne({ where: { numero_documento: numeroDocEst } });
      if (personaExistente) {
        return res.status(400).json({ mensaje: 'Ya existe una persona con ese número de documento' });
      }

      // Crear Persona Estudiante
      const personaEstudiante = await Persona.create({
        numero_documento: numeroDocEst,
        nombre: estudiante.nombre,
        apellido: estudiante.apellido,
        correo: estudiante.correo,
        telefono: estudiante.telefono,
        direccion: estudiante.direccion,
        ciudad_residencia: estudiante.ciudad,
        tipo_sangre: estudiante.tipo_sangre,
        discapacidad: estudiante.discapacidad,
        ocupacion: estudiante.ocupacion,
        fecha_nacimiento: estudiante.fecha_nacimiento,
        id_tipo_documento: estudiante.tipo_documento,
        id_sexo: estudiante.sexo
      }, { transaction: t });

      // Crear Usuario Estudiante
      const usuarioEstudiante = await Usuario.create({
        username: `est${numeroDocEst}`,
        contrasena: numeroDocEst,
        numero_documento: numeroDocEst,
        id_tipo_usuario: 1,
        id_estado_usuario: 1
      }, { transaction: t });

      // Guardar archivos en la base de datos (no en el disco)
      const archivosEstudiante = [
        {
          file: foto,
          tipo_documento: 'Foto tipo carné'
        },
        {
          file: documento,
          tipo_documento: 'Copia del documento'
        }
      ];

      for (const { file, tipo_documento } of archivosEstudiante) {
        const buffer = fs.readFileSync(file.path); // Leer el archivo subido

        await Archivo.create({
          nombre_original: file.originalname,
          nombre_sistema: file.filename,
          tipo: file.mimetype,
          contenido: buffer,
          tipo_documento,
          id_usuario: usuarioEstudiante.id_usuario,
          fecha_subida: new Date()
        }, { transaction: t });

        fs.unlinkSync(file.path); // Eliminar archivo físico temporal
      }

      // Crear Persona Acudiente
      const personaAcudiente = await Persona.create({
        numero_documento: numeroDocAcu,
        nombre: acudiente.nombre,
        apellido: acudiente.apellido,
        correo: acudiente.correo,
        telefono: acudiente.telefono,
        direccion: acudiente.direccion,
        ciudad_residencia: acudiente.ciudad,
        tipo_sangre: acudiente.tipo_sangre,
        discapacidad: acudiente.discapacidad,
        ocupacion: acudiente.ocupacion,
        fecha_nacimiento: acudiente.fecha_nacimiento,
        id_tipo_documento: acudiente.tipo_documento,
        id_sexo: acudiente.sexo
      }, { transaction: t });

      // Crear Usuario Acudiente
      const usuarioAcudiente = await Usuario.create({
        username: `acu${numeroDocAcu}`,
        contrasena: numeroDocAcu,
        numero_documento: numeroDocAcu,
        id_tipo_usuario: 2,
        id_estado_usuario: 1
      }, { transaction: t });

      const acudienteNuevo = await Acudiente.create({
        numero_documento: numeroDocAcu,
        id_usuario: usuarioAcudiente.id_usuario
      }, { transaction: t });

      const estudianteNuevo = await Estudiante.create({
        numero_documento: numeroDocEst,
        id_usuario: usuarioEstudiante.id_usuario,
        id_eps: estudiante.eps,
        id_estado_academico: estudiante.estado_academico,
        id_acudiente: acudienteNuevo.id_acudiente
      }, { transaction: t });

      await t.commit();

      res.status(201).json({
        mensaje: 'Registro exitoso',
        usuario_estudiante: usuarioEstudiante.username,
        contrasena_estudiante: usuarioEstudiante.contrasena,
        usuario_acudiente: usuarioAcudiente.username,
        contrasena_acudiente: usuarioAcudiente.contrasena
      });

    } catch (error) {
      await t.rollback();
      console.error('❌ Error al registrar:', error);
      res.status(500).json({
        mensaje: 'Error interno al registrar',
        error: {
          message: error.message,
          stack: error.stack,
          name: error.name
        }
      });
    }
  }
};

module.exports = registrarEstudianteCompleto;
