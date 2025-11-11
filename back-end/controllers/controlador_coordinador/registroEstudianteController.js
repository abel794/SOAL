// controllers/controlador_coordinador/registroEstudianteController.js
const bcrypt = require('bcrypt');
const fs = require('fs');
const { enviarCorreo } = require('../../services/emailService');
const {
  Persona,
  Usuario,
  Estudiante,
  Acudiente,
  Archivo,
  EstudianteGrado,
  EstudianteAcudiente,
  RelacionAcudiente,
  sequelize
} = require('../../models');

const registrarEstudianteCompleto = {
  async registrarTodo(req, res) {
    const t = await sequelize.transaction();

    try {
      const parsed = JSON.parse(req.body.formulario || '{}');
      const { estudiante, acudiente, id_grado, id_relacion } = parsed;

      // archivos
      const foto = req.files?.['fotoEstudiante']?.[0];
      const cedulaEstudiante = req.files?.['cedulaEstudiante']?.[0];
      const cedulaAcudiente = req.files?.['cedulaAcudiente']?.[0];
      const registroAnterior = req.files?.['registroAnteriorColegio']?.[0];
      const certificadoEPS = req.files?.['certificadoEPS']?.[0];
      const reciboServicio = req.files?.['reciboServicio']?.[0];

      // validaciones básicas
      if (!foto || !cedulaEstudiante) {
        return res.status(400).json({ mensaje: 'Faltan archivos requeridos (foto y cédula del estudiante)' });
      }
      if (!estudiante || !estudiante.numero_documento) {
        return res.status(400).json({ mensaje: 'Datos del estudiante incompletos' });
      }
      if (!id_grado) {
        return res.status(400).json({ mensaje: 'Debes seleccionar grado' });
      }

      const numeroDocEst = estudiante.numero_documento;

      // verificar si el estudiante ya existe (por documento)
      const personaExistente = await Persona.findOne({ where: { numero_documento: numeroDocEst } });
      if (personaExistente) {
        return res.status(400).json({ mensaje: 'Ya existe un estudiante con ese número de documento' });
      }

      // ---- Crear Persona Estudiante ----
      const personaEstudiante = await Persona.create({
        numero_documento: numeroDocEst,
        nombre: estudiante.nombre || null,
        apellido: estudiante.apellido || null,
        correo: estudiante.correo || null,
        telefono: estudiante.telefono || null,
        direccion: estudiante.direccion || null,
        ciudad_residencia: estudiante.ciudad_residencia || estudiante.ciudad || null,
        tipo_sangre: estudiante.tipo_sangre || null,
        discapacidad: estudiante.discapacidad || null,
        ocupacion: estudiante.ocupacion || null,
        fecha_nacimiento: estudiante.fecha_nacimiento || null,
        id_tipo_documento: estudiante.id_tipo_documento || estudiante.tipo_documento || null,
        id_sexo: estudiante.id_sexo || estudiante.sexo || null
      }, { transaction: t });

      // crear usuario estudiante
      const contrasenaEstudiantePlano = numeroDocEst;
      const hashContrasenaEst = await bcrypt.hash(contrasenaEstudiantePlano, 10);

      const usuarioEstudiante = await Usuario.create({
        username: `est${numeroDocEst}`,
        contrasena: hashContrasenaEst,
        numero_documento: numeroDocEst,
        id_tipo_usuario: 1,
        id_estado_usuario: 1
      }, { transaction: t });

      // guardar archivos (si vienen)
      const archivosEstudiante = [
        { file: foto, tipo_documento: 'Foto tipo carné' },
        { file: cedulaEstudiante, tipo_documento: 'Cédula del estudiante' },
        { file: cedulaAcudiente, tipo_documento: 'Cédula del acudiente' },
        { file: registroAnterior, tipo_documento: 'Registro anterior colegio' },
        { file: certificadoEPS, tipo_documento: 'Certificado EPS' },
        { file: reciboServicio, tipo_documento: 'Recibo de servicio' }
      ];

      for (const { file, tipo_documento } of archivosEstudiante) {
        if (!file) continue;
        const buffer = fs.readFileSync(file.path);
        await Archivo.create({
          nombre_original: file.originalname,
          nombre_sistema: file.filename,
          tipo: file.mimetype,
          contenido: buffer,
          tipo_documento,
          id_usuario: usuarioEstudiante.id_usuario,
          fecha_subida: new Date()
        }, { transaction: t });
        // limpiar temp
        try { fs.unlinkSync(file.path); } catch (e) { /* no-crash */ }
      }

      // ---- Acudiente: puede venir como { id_acudiente } (existente) o datos para crearlo ----
      let acudienteRegistro = null; // Acudiente model instance (existente o creado)
      let usuarioAcudiente = null;
      let acudienteEsNuevo = false;
      let relacionFinal = id_relacion || null; // id_relacion final a usar en pivote

      if (acudiente && acudiente.id_acudiente) {
        // BUSCAR acudiente por id e incluir persona y pivotes para relación existente
        acudienteRegistro = await Acudiente.findByPk(acudiente.id_acudiente, {
          include: [
            { model: Persona, as: 'persona' },
            { model: EstudianteAcudiente, as: 'pivotes' }
          ]
        });

        if (!acudienteRegistro) {
          return res.status(400).json({ mensaje: 'El acudiente indicado (id_acudiente) no existe' });
        }

        // obtener usuario del acudiente si existe
        usuarioAcudiente = await Usuario.findOne({ where: { numero_documento: acudienteRegistro.numero_documento } });

        // si no se envió id_relacion y hay pivotes, intentar reutilizar la relación del primer pivote
        if (!relacionFinal && Array.isArray(acudienteRegistro.pivotes) && acudienteRegistro.pivotes.length > 0) {
          relacionFinal = acudienteRegistro.pivotes[0].id_relacion || null;
        }
      } else {
        // Acudiente nuevo: necesitamos datos mínimos (numero_documento, nombre, etc.)
        if (!acudiente || !acudiente.numero_documento) {
          await t.rollback();
          return res.status(400).json({ mensaje: 'Datos de acudiente incompletos (numero_documento requerido cuando es nuevo)' });
        }

        // Si existe persona con ese documento (solo persona) reutilizarla
        let personaAcudiente = await Persona.findOne({ where: { numero_documento: acudiente.numero_documento } }, { transaction: t });

        if (!personaAcudiente) {
          personaAcudiente = await Persona.create({
            numero_documento: acudiente.numero_documento,
            nombre: acudiente.nombre || null,
            apellido: acudiente.apellido || null,
            correo: acudiente.correo || null,
            telefono: acudiente.telefono || null,
            direccion: acudiente.direccion || null,
            ciudad_residencia: acudiente.ciudad_residencia || acudiente.ciudad || null,
            tipo_sangre: acudiente.tipo_sangre || null,
            discapacidad: acudiente.discapacidad || null,
            ocupacion: acudiente.ocupacion || null,
            fecha_nacimiento: acudiente.fecha_nacimiento || null,
            id_tipo_documento: acudiente.id_tipo_documento || acudiente.tipo_documento || null,
            id_sexo: acudiente.id_sexo || acudiente.sexo || null
          }, { transaction: t });
        }

        // crear usuario y registro de acudiente
        const numeroDocAcu = personaAcudiente.numero_documento;
        const contrasenaAcudientePlano = numeroDocAcu;
        const hashContrasenaAcu = await bcrypt.hash(contrasenaAcudientePlano, 10);

        usuarioAcudiente = await Usuario.create({
          username: `acu${numeroDocAcu}`,
          contrasena: hashContrasenaAcu,
          numero_documento: numeroDocAcu,
          id_tipo_usuario: 2,
          id_estado_usuario: 1
        }, { transaction: t });

        acudienteRegistro = await Acudiente.create({
          numero_documento: numeroDocAcu,
          id_usuario: usuarioAcudiente.id_usuario
        }, { transaction: t });

        acudienteEsNuevo = true;
      }

      // ---- Crear estudiante (tabla estudiante) ----
      const estudianteNuevo = await Estudiante.create({
        numero_documento: numeroDocEst,
        id_usuario: usuarioEstudiante.id_usuario,
        id_eps: estudiante.id_eps || estudiante.eps || null,
        id_estado_academico: estudiante.id_estado_academico || estudiante.estado_academico || null
      }, { transaction: t });

      // relacion estudiante-grado
      await EstudianteGrado.create({
        id_estudiante: estudianteNuevo.id_estudiante,
        id_grado: id_grado,
        anio_academico: new Date().getFullYear()
      }, { transaction: t });

      // ---- Validar relacionFinal (id_relacion) antes de crear pivote ----
      if (!relacionFinal) {
        // si acudiente es nuevo y no enviaste id_relacion -> error (no sabemos relación)
        if (acudienteEsNuevo) {
          await t.rollback();
          return res.status(400).json({ mensaje: 'Debes especificar el parentesco (id_relacion) para un acudiente nuevo' });
        }
        // si acudiente existía y no se encontró relacion en pivotes -> error
        if (!acudienteEsNuevo) {
          await t.rollback();
          return res.status(400).json({ mensaje: 'No se encontró relación existente y no enviaste id_relacion' });
        }
      }

      // crear pivote estudiante-acudiente
      await EstudianteAcudiente.create({
        id_estudiante: estudianteNuevo.id_estudiante,
        id_acudiente: acudienteRegistro.id_acudiente,
        id_relacion: relacionFinal
      }, { transaction: t });

      await t.commit();

      // correos: estudiante
      try {
        await enviarCorreo(
          estudiante.correo,
          "Registro exitoso - Estudiante",
          `Hola ${estudiante.nombre || ''},\n\nTu registro fue exitoso.\nUsuario: ${usuarioEstudiante.username}\nContraseña: ${contrasenaEstudiantePlano}\n\nInstituto`
        );
      } catch (e) { console.error('Error enviando correo estudiante', e); }

      // correo acudiente
      try {
        if (acudienteEsNuevo) {
          await enviarCorreo(
            acudiente.correo,
            "Registro exitoso - Acudiente",
            `Hola ${acudiente.nombre || ''},\n\nSe ha creado tu cuenta como acudiente.\nUsuario: ${usuarioAcudiente.username}\nContraseña: ${contrasenaAcudientePlano}\n\nInstituto`
          );
        } else {
          // notificación para acudiente existente (no contraseña)
          await enviarCorreo(
            acudienteRegistro?.persona?.correo || acudiente.correo,
            "Notificación de registro - Acudiente",
            `Hola,\n\nSe ha registrado un estudiante bajo su cuenta.\nUsuario: ${usuarioAcudiente?.username || 'N/A'}\n\nInstituto`
          );
        }
      } catch (e) { console.error('Error enviando correo acudiente', e); }

      return res.status(201).json({
        mensaje: 'Registro exitoso',
        usuario_estudiante: usuarioEstudiante.username,
        contrasena_estudiante: contrasenaEstudiantePlano,
        usuario_acudiente: usuarioAcudiente?.username || null,
        contrasena_acudiente: acudienteEsNuevo ? (acudiente.numero_documento || null) : null
      });
    } catch (error) {
      await t.rollback();

      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({
          mensaje: 'Error de registro - valor duplicado',
          detalles: error.errors.map(e => ({
            tabla: e.instance?.constructor?.name || 'desconocida',
            campo: e.path,
            valor: e.value,
            mensaje: e.message
          })),
          sql: error.sql || null
        });
      }

      console.error('❌ Error al registrar:', error);
      return res.status(500).json({ mensaje: 'Error interno al registrar', error: error.message });
    }
  },

  // (mantengo tu función buscarPorDocumento tal cual)
  async buscarPorDocumento(req, res) {
    try {
      const { documento } = req.query;

      if (!documento) {
        return res.status(400).json({ mensaje: 'Se requiere número de documento' });
      }

      const acudiente = await Acudiente.findOne({
        where: { numero_documento: documento },
        include: [
          { model: Persona, as: 'persona' },
          { model: Usuario, as: 'usuario', attributes: ['username', 'numero_documento'] },
          {
            model: EstudianteAcudiente,
            as: 'pivotes',
            include: [
              {
                model: Estudiante,
                as: 'estudiante',
                include: [
                  { model: Persona, as: 'persona' }
                ]
              },
              { model: RelacionAcudiente, as: 'relacion' }
            ]
          }
        ]
      });

      if (!acudiente) {
        return res.status(404).json({ mensaje: 'Acudiente no encontrado' });
      }

      const estudiantes = (acudiente.pivotes || []).map(p => ({
        id_estudiante: p.estudiante.id_estudiante,
        nombre: p.estudiante.persona.nombre,
        apellido: p.estudiante.persona.apellido,
        grado: p.estudiante.grado_actual || 'No asignado',
        relacion: p.relacion?.nombre || 'No especificada',
        id_relacion: p.id_relacion || null
      }));

      return res.json({
        id_acudiente: acudiente.id_acudiente,
        numero_documento: acudiente.numero_documento,
        nombre: acudiente.persona?.nombre,
        apellido: acudiente.persona?.apellido,
        correo: acudiente.persona?.correo,
        telefono: acudiente.persona?.telefono,
        direccion: acudiente.persona?.direccion,
        ciudad: acudiente.persona?.ciudad_residencia,
        sexo: acudiente.persona?.id_sexo,
        tipo_documento: acudiente.persona?.id_tipo_documento,
        estudiantes
      });

    } catch (err) {
      console.error('❌ Error al buscar acudiente:', err);
      res.status(500).json({ mensaje: 'Error interno al buscar acudiente' });
    }
  }
};

module.exports = registrarEstudianteCompleto;
