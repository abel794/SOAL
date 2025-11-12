// controllers/registrarFuncionario.js
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const zlib = require('zlib');
const db = require('../../models');
const { Op } = require('sequelize');
const { enviarCorreo } = require('../../services/emailService');

const { Persona, Usuario, Funcionario, Archivo, sequelize } = db;

/** ---------- HELPERS ---------- **/

function getFilePath(file) {
  if (!file) return null;
  if (file.path) return file.path;
  if (file.destination && file.filename) return path.join(file.destination, file.filename);
  if (file.fieldname && file.originalname) {
    return path.join('uploads', file.filename || file.originalname);
  }
  return null;
}

function safeUnlinkSync(filePath) {
  try {
    if (!filePath) return;
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  } catch (e) {
    console.warn('No se pudo eliminar archivo temporal:', filePath, e.message);
  }
}

function compressBuffer(buffer) {
  try {
    return zlib.gzipSync(buffer);
  } catch (err) {
    console.error('Error al comprimir buffer:', err);
    return buffer;
  }
}

function extractFile(req, fieldName) {
  if (!req.files) return null;
  if (Array.isArray(req.files)) {
    return req.files.find(f => f.fieldname === fieldName) || null;
  } else if (typeof req.files === 'object') {
    const arr = req.files[fieldName];
    if (Array.isArray(arr) && arr.length) return arr[0];
    return null;
  }
  return null;
}

/** ---------- CONTROLADOR ---------- **/

const registrarFuncionarioCompleto = {
  async registrarTodo(req, res) {
    const t = await sequelize.transaction();
    const archivosTemporales = [];

    try {
      console.log('--- Inicio registro funcionario ---');

      // Parseo robusto de los objetos persona/usuario/funcionario (pueden venir como JSON-string o campos sueltos)
      let personaObj = null;
      let usuarioObj = null;
      let funcionarioObj = null;

      if (req.body.persona) {
        try { personaObj = typeof req.body.persona === 'string' ? JSON.parse(req.body.persona) : req.body.persona; }
        catch (e) { personaObj = req.body.persona; }
      } else {
        personaObj = {
          numero_documento: req.body.numero_documento,
          nombre: req.body.nombre,
          apellido: req.body.apellido,
          correo: req.body.correo,
          telefono: req.body.telefono,
          direccion: req.body.direccion,
          ciudad_residencia: req.body.ciudad_residencia,
          tipo_sangre: req.body.tipo_sangre,
          discapacidad: req.body.discapacidad || 'No',
          ocupacion: req.body.ocupacion,
          fecha_nacimiento: req.body.fecha_nacimiento,
          id_sexo: req.body.id_sexo ? Number(req.body.id_sexo) : null,
          id_tipo_documento: req.body.id_tipo_documento ? Number(req.body.id_tipo_documento) : null
        };
      }

      if (req.body.usuario) {
        try { usuarioObj = typeof req.body.usuario === 'string' ? JSON.parse(req.body.usuario) : req.body.usuario; }
        catch (e) { usuarioObj = req.body.usuario; }
      } else {
        usuarioObj = {
          username: req.body.username,
          contrasena: req.body.contrasena,
          id_tipo_usuario: req.body.id_tipo_usuario ? Number(req.body.id_tipo_usuario) : undefined
        };
      }

      if (req.body.funcionario) {
        try { funcionarioObj = typeof req.body.funcionario === 'string' ? JSON.parse(req.body.funcionario) : req.body.funcionario; }
        catch (e) { funcionarioObj = req.body.funcionario; }
      } else {
        funcionarioObj = {
          cargo: req.body.cargo,
          arl: req.body.arl,
          id_escolaridad: req.body.id_escolaridad ? Number(req.body.id_escolaridad) : null
        };
      }

      // Defensa: si personaObj trae una propiedad 'foto' dentro del JSON, quitarla
      if (personaObj && typeof personaObj === 'object' && 'foto' in personaObj) {
        delete personaObj.foto;
      }

      // Guardar rutas temporales provistas por multer (si las hay) para limpieza posterior
      if (req.files) {
        if (Array.isArray(req.files)) {
          req.files.forEach(f => archivosTemporales.push(getFilePath(f)));
        } else {
          Object.values(req.files).forEach(arr => {
            if (Array.isArray(arr)) arr.forEach(f => archivosTemporales.push(getFilePath(f)));
          });
        }
      }

      // Validaciones mínimas
      if (!personaObj || !personaObj.numero_documento) {
        await t.rollback();
        archivosTemporales.forEach(p => safeUnlinkSync(p));
        return res.status(400).json({ mensaje: 'Falta información de persona (numero_documento).' });
      }
      const numeroDoc = personaObj.numero_documento;

      // 1) Verificar persona duplicada
      const personaExistente = await Persona.findOne({ where: { numero_documento: numeroDoc }, transaction: t });
      if (personaExistente) {
        await t.rollback();
        archivosTemporales.forEach(p => safeUnlinkSync(p));
        return res.status(400).json({ mensaje: 'El número de documento ya existe en Persona' });
      }

      // Crear persona
      const personaCreada = await Persona.create(personaObj, { transaction: t });
      console.log('Persona creada id:', personaCreada.id_persona || personaCreada.numero_documento);

      // 2) Verificar datos de usuario y duplicados
      if (!usuarioObj || !usuarioObj.username || !usuarioObj.contrasena) {
        await t.rollback();
        archivosTemporales.forEach(p => safeUnlinkSync(p));
        return res.status(400).json({ mensaje: 'Faltan datos de usuario (username y/o contrasena).' });
      }

      const usuarioExistente = await Usuario.findOne({
        where: {
          [Op.or]: [
            { username: usuarioObj.username },
            { numero_documento: numeroDoc }
          ]
        },
        transaction: t
      });
      if (usuarioExistente) {
        await t.rollback();
        archivosTemporales.forEach(p => safeUnlinkSync(p));
        return res.status(400).json({ mensaje: 'El username o documento ya existe en Usuario' });
      }

      // Guardamos la contraseña en plano para usar en el email/response (si el front la envía)
      const plainPassword = usuarioObj.contrasena;
      const hashedPassword = await bcrypt.hash(plainPassword, 10);

      const usuarioNuevo = await Usuario.create({
        ...usuarioObj,
        contrasena: hashedPassword,
        numero_documento: numeroDoc
      }, { transaction: t });

      console.log('Usuario creado id:', usuarioNuevo.id_usuario);

      // 3) Verificar funcionario duplicado y crear
      const funcionarioExistente = await Funcionario.findOne({
        where: {
          [Op.or]: [
            { numero_documento: numeroDoc },
            { id_usuario: usuarioNuevo.id_usuario }
          ]
        },
        transaction: t
      });

      if (funcionarioExistente) {
        await t.rollback();
        archivosTemporales.forEach(p => safeUnlinkSync(p));
        return res.status(400).json({ mensaje: 'Ya existe un Funcionario con ese documento o usuario' });
      }

      const funcionarioNuevo = await Funcionario.create({
        ...funcionarioObj,
        numero_documento: numeroDoc,
        id_usuario: usuarioNuevo.id_usuario
      }, { transaction: t });

      console.log('Funcionario creado id:', funcionarioNuevo.id_funcionario);

      // 4) Guardar foto (si viene)
      const fotoFile = extractFile(req, 'foto');
      if (fotoFile) {
        const fotoPath = getFilePath(fotoFile);
        if (fotoPath && fs.existsSync(fotoPath)) {
          const bufferFoto = fs.readFileSync(fotoPath);
          const bufferComprimido = compressBuffer(bufferFoto);

          await Archivo.create({
            nombre_original: fotoFile.originalname,
            nombre_sistema: fotoFile.filename,
            tipo: fotoFile.mimetype,
            contenido: bufferComprimido,
            tipo_documento: 'Foto',
            id_usuario: usuarioNuevo.id_usuario,
            fecha_subida: new Date()
          }, { transaction: t });

          safeUnlinkSync(fotoPath);
        }
      }

      // 5) Archivos requeridos: EPS, ARL, Hoja de Vida, Acta de Grado, RUT
      const camposArchivos = {
        archivo_eps: 'EPS',
        archivo_arl: 'ARL',
        archivo_hoja_vida: 'Hoja de Vida',
        archivo_acta_grado: 'Acta de Grado',
        archivo_rut: 'RUT'
      };

      for (const [campo, tipo_documento] of Object.entries(camposArchivos)) {
        const archivo = extractFile(req, campo);
        if (!archivo) {
          await t.rollback();
          archivosTemporales.forEach(p => safeUnlinkSync(p));
          return res.status(400).json({ mensaje: `Falta el archivo requerido: ${tipo_documento} (campo ${campo})` });
        }

        const archivoPath = getFilePath(archivo);
        if (!archivoPath || !fs.existsSync(archivoPath)) {
          await t.rollback();
          archivosTemporales.forEach(p => safeUnlinkSync(p));
          return res.status(500).json({ mensaje: `No se pudo determinar la ruta del archivo ${campo}` });
        }

        const buf = fs.readFileSync(archivoPath);
        const bufComp = compressBuffer(buf);

        await Archivo.create({
          nombre_original: archivo.originalname,
          nombre_sistema: archivo.filename,
          tipo: archivo.mimetype,
          contenido: bufComp,
          tipo_documento,
          id_usuario: usuarioNuevo.id_usuario,
          fecha_subida: new Date()
        }, { transaction: t });

        safeUnlinkSync(archivoPath);
      }

      // 6) Commit
      await t.commit();
      console.log('Registro completado exitosamente para documento:', numeroDoc);

      // Preparar datos para el correo
      const nombrePersona = personaObj.nombre || '';
      const apellidoPersona = personaObj.apellido || '';
      const correoDestino = personaObj.correo || usuarioObj.correo || null;
      const usernameParaEmail = usuarioObj.username || usuarioNuevo.username;
      const passwordParaEmail = plainPassword || '';

      const asunto = "Registro Exitoso - Instituto Renato Descartes";
      const mensajeEmail = `
Hola ${nombrePersona} ${apellidoPersona},

Tu registro como funcionario en el sistema del Instituto Renato Descartes ha sido exitoso.

Tus credenciales de acceso:
  Usuario: ${usernameParaEmail}
  Contraseña: ${passwordParaEmail}

Por seguridad, cambia tu contraseña en el primer inicio de sesión.

Atentamente,
Instituto Renato Descartes
      `;

      // 7) Enviar correo (no bloqueante en el sentido de revertir, pero await para loguear resultado)
      if (correoDestino) {
        try {
          await enviarCorreo(correoDestino, asunto, mensajeEmail);
          console.log(`📩 Correo enviado a ${correoDestino}`);
        } catch (emailErr) {
          console.error('Error al enviar correo (registro ya realizado):', emailErr);
        }
      } else {
        console.warn('No se encontró correo destino para el funcionario, no se envió email.');
      }

      // 8) Responder al cliente (incluye contraseña en plano si así lo requieres)
      return res.status(201).json({
        mensaje: '✅ Funcionario registrado con éxito',
        usuario: {
          username: usuarioNuevo.username,
          contrasena: passwordParaEmail
        },
        id_funcionario: funcionarioNuevo.id_funcionario || funcionarioNuevo.id
      });
    } catch (error) {
      // Rollback y limpieza de temporales
      try { await t.rollback(); } catch (e) { /* ignore */ }

      if (req.files) {
        if (Array.isArray(req.files)) {
          req.files.forEach(f => safeUnlinkSync(getFilePath(f)));
        } else {
          Object.values(req.files).forEach(arr => {
            if (Array.isArray(arr)) arr.forEach(f => safeUnlinkSync(getFilePath(f)));
          });
        }
      }

      console.error('❌ Error al registrar funcionario:', error);
      const msg = error && error.message ? error.message : 'Error interno';
      return res.status(500).json({ mensaje: 'Error al registrar funcionario', error: msg });
    }
  }
};

module.exports = registrarFuncionarioCompleto;
