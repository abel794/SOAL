// controllers/registrarFuncionario.js
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const zlib = require('zlib');
const db = require('../../models');
const { Op } = require('sequelize');

const { Persona, Usuario, Funcionario, Archivo, sequelize } = db;

/**
 * Devuelve la ruta física del archivo multer, con varios fallbacks.
 * @param {Object} file - objeto file que retorna multer
 * @returns {string|null} ruta o null si no se puede determinar
 */
function getFilePath(file) {
  if (!file) return null;
  if (file.path) return file.path; // normalmente con dest o multer.any()
  if (file.destination && file.filename) return path.join(file.destination, file.filename);
  if (file.fieldname && file.originalname) {
    // último recurso (no siempre aplicable)
    return path.join('uploads', file.filename || file.originalname);
  }
  return null;
}

/** Eliminar archivo silenciosamente */
function safeUnlinkSync(filePath) {
  try {
    if (!filePath) return;
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  } catch (e) {
    console.warn('No se pudo eliminar archivo temporal:', filePath, e.message);
  }
}

/** Comprime buffer con gzip (devuelve buffer comprimido o el original si falla) */
function compressBuffer(buffer) {
  try {
    return zlib.gzipSync(buffer);
  } catch (err) {
    console.error('Error al comprimir buffer:', err);
    return buffer;
  }
}

/** Helper: extrae archivo del req.files soportando upload.fields y upload.any */
function extractFile(req, fieldName) {
  if (!req.files) return null;
  // multer con fields() deja req.files como objeto { campo: [file] }
  if (Array.isArray(req.files)) {
    // multer.any(): array de files
    return req.files.find(f => f.fieldname === fieldName) || null;
  } else if (typeof req.files === 'object') {
    const arr = req.files[fieldName];
    if (Array.isArray(arr) && arr.length) return arr[0];
    return null;
  }
  return null;
}

const registrarFuncionarioCompleto = {
  async registrarTodo(req, res) {
    // Crear transacción
    const t = await sequelize.transaction();
    // track temporales para limpiar
    const archivosTemporales = [];

    try {
      console.log('--- Inicio registro funcionario ---');

      // --- Parseo seguro de los objetos persona/usuario/funcionario ---
      let personaObj = null;
      let usuarioObj = null;
      let funcionarioObj = null;

      // Si vienen como strings JSON (caso esperado)
      if (req.body.persona) {
        try {
          personaObj = JSON.parse(req.body.persona);
        } catch (e) {
          // fallback: si por algún motivo no es JSON, intenta usar directamente
          personaObj = req.body.persona;
        }
      } else {
        // si front envió campos sueltos, intenta construir persona desde req.body
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
        try {
          usuarioObj = JSON.parse(req.body.usuario);
        } catch (e) {
          usuarioObj = req.body.usuario;
        }
      } else {
        usuarioObj = {
          username: req.body.username,
          contrasena: req.body.contrasena,
          id_tipo_usuario: req.body.id_tipo_usuario ? Number(req.body.id_tipo_usuario) : undefined
        };
      }

      if (req.body.funcionario) {
        try {
          funcionarioObj = JSON.parse(req.body.funcionario);
        } catch (e) {
          funcionarioObj = req.body.funcionario;
        }
      } else {
        funcionarioObj = {
          cargo: req.body.cargo,
          arl: req.body.arl,
          id_escolaridad: req.body.id_escolaridad ? Number(req.body.id_escolaridad) : null
        };
      }

      // --- Quitar la propiedad foto del objeto persona antes de stringify en front (defensa) ---
      // (si por alguna razón el front manda un File dentro del JSON)
      if (typeof personaObj === 'object' && personaObj !== null && 'foto' in personaObj) {
        delete personaObj.foto;
      }

      // Guardar paths temporales listos para limpieza (si multer los colocó)
      if (req.files) {
        if (Array.isArray(req.files)) {
          req.files.forEach(f => archivosTemporales.push(getFilePath(f)));
        } else {
          Object.values(req.files).forEach(arr => {
            if (Array.isArray(arr)) arr.forEach(f => archivosTemporales.push(getFilePath(f)));
          });
        }
      }

      // Validaciones básicas
      if (!personaObj || !personaObj.numero_documento) {
        await t.rollback();
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

      // 2) Verificar usuario duplicado
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

      // Encriptar contraseña
      const hashedPassword = await bcrypt.hash(usuarioObj.contrasena, 10);

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

      // --- Guardar foto (si viene) ---
      const fotoFile = extractFile(req, 'foto');
      if (fotoFile) {
        const fotoPath = getFilePath(fotoFile);
        if (fotoPath) {
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

      // --- Archivos requeridos ---
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
          // Rollback y cleanup si falta uno de los obligatorios
          await t.rollback();
          archivosTemporales.forEach(p => safeUnlinkSync(p));
          return res.status(400).json({ mensaje: `Falta el archivo requerido: ${tipo_documento} (campo ${campo})` });
        }

        const archivoPath = getFilePath(archivo);
        if (!archivoPath) {
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

        // eliminar temporal del disco
        safeUnlinkSync(archivoPath);
      }

      // --- Commit & respuesta ---
      await t.commit();

      console.log('Registro completado exitosamente para documento:', numeroDoc);

      return res.status(201).json({
        mensaje: '✅ Funcionario registrado con éxito',
        usuario: {
          username: usuarioNuevo.username,
          contrasena: usuarioObj.contrasena // devolver original (si esa es tu necesidad)
        },
        id_funcionario: funcionarioNuevo.id_funcionario
      });
    } catch (error) {
      // rollback seguro
      try { await t.rollback(); } catch (e) { /* ignore */ }

      // limpiar temporales
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
      // si error tiene detalle de sequelize, devuelve mensaje legible
      const msg = error && error.message ? error.message : 'Error interno';
      return res.status(500).json({ mensaje: 'Error al registrar funcionario', error: msg });
    }
  }
};

module.exports = registrarFuncionarioCompleto;
