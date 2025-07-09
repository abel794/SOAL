const fs = require('fs');
const db = require('../models');
const { Op } = require('sequelize');

const { Persona, Usuario, Funcionario, Archivo, sequelize } = db;

const registrarFuncionarioCompleto = {
  async registrarTodo(req, res) {
    const t = await sequelize.transaction();

    try {
      // ✅ Extraer datos JSON del formulario
      const persona = JSON.parse(req.body.persona);
      const usuario = JSON.parse(req.body.usuario);
      const funcionario = JSON.parse(req.body.funcionario);
      const numeroDoc = persona.numero_documento;

      // ✅ Verificar existencia de persona
      const personaExistente = await Persona.findOne({ where: { numero_documento: numeroDoc }, transaction: t });
      if (personaExistente) {
        await t.rollback();
        return res.status(400).json({ mensaje: 'El número de documento ya existe en Persona' });
      }

      const personaNueva = await Persona.create(persona, { transaction: t });

      // ✅ Verificar existencia de usuario
      const usuarioExistente = await Usuario.findOne({
        where: {
          [Op.or]: [
            { username: usuario.username },
            { numero_documento: numeroDoc }
          ]
        },
        transaction: t
      });
      if (usuarioExistente) {
        await t.rollback();
        return res.status(400).json({ mensaje: 'El username o documento ya existe en Usuario' });
      }

      const usuarioNuevo = await Usuario.create({
        ...usuario,
        numero_documento: numeroDoc
      }, { transaction: t });

      // ✅ Verificar existencia de funcionario
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
        return res.status(400).json({ mensaje: 'Ya existe un Funcionario con ese documento o usuario' });
      }

      const funcionarioNuevo = await Funcionario.create({
        ...funcionario,
        numero_documento: numeroDoc,
        id_usuario: usuarioNuevo.id_usuario
      }, { transaction: t });

      // ✅ Guardar todos los archivos adjuntos
      const camposArchivos = {
        archivo_eps: 'EPS',
        archivo_arl: 'ARL',
        archivo_hoja_vida: 'Hoja de Vida',
        archivo_acta_grado: 'Acta de Grado',
        archivo_rut: 'RUT'
      };

      for (const [campo, tipo_documento] of Object.entries(camposArchivos)) {
        const archivo = req.files?.[campo]?.[0];
        if (!archivo) {
          await t.rollback();
          return res.status(400).json({ mensaje: `Falta el archivo requerido: ${tipo_documento}` });
        }

        const buffer = fs.readFileSync(archivo.path);

        await Archivo.create({
          nombre_original: archivo.originalname,
          nombre_sistema: archivo.filename,
          tipo: archivo.mimetype,
          contenido: buffer,
          tipo_documento,
          id_usuario: usuarioNuevo.id_usuario,
          fecha_subida: new Date()
        }, { transaction: t });

        fs.unlinkSync(archivo.path); // Eliminar del servidor
      }

      await t.commit();

      res.status(201).json({
        mensaje: '✅ Funcionario registrado con éxito',
        usuario: {
          username: usuarioNuevo.username,
          contrasena: usuario.contrasena
        },
        id_funcionario: funcionarioNuevo.id_funcionario
      });

    } catch (error) {
      await t.rollback();
      console.error('❌ Error al registrar funcionario:', error);
      res.status(500).json({ mensaje: 'Error al registrar funcionario', error });
    }
  }
};

module.exports = registrarFuncionarioCompleto;
