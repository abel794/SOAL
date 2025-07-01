const db = require('../models');
const { Op } = require('sequelize');

const Persona = db.Persona;
const Usuario = db.Usuario;
const Funcionario = db.Funcionario;

const registrarFuncionarioCompleto = {

  async registrarTodo(req, res) {
    const t = await db.sequelize.transaction();
    
    try {
      const { persona, usuario, funcionario } = req.body;

      // 🔹 Validar existencia de la persona
      const personaExistente = await Persona.findOne({
        where: { numero_documento: persona.numero_documento },
        transaction: t
      });

      if (personaExistente) {
        await t.rollback();
        return res.status(400).json({ mensaje: 'El número de documento ya existe en Persona' });
      }

      // 🔹 Crear Persona
      const personaNueva = await Persona.create(persona, { transaction: t });

      // 🔹 Validar existencia de usuario (username o documento)
      const usuarioExistente = await Usuario.findOne({
        where: {
          [Op.or]: [
            { username: usuario.username },
            { numero_documento: persona.numero_documento }
          ]
        },
        transaction: t
      });

      if (usuarioExistente) {
        await t.rollback();
        return res.status(400).json({ mensaje: 'El username o documento ya existe en Usuario' });
      }

      // 🔹 Crear Usuario (asocia número_documento de persona)
      const usuarioNuevo = await Usuario.create({
        ...usuario,
        numero_documento: persona.numero_documento
      }, { transaction: t });

      // 🔹 Validar existencia de funcionario (documento o id_usuario)
      const funcionarioExistente = await Funcionario.findOne({
        where: {
          [Op.or]: [
            { numero_documento: persona.numero_documento },
            { id_usuario: usuarioNuevo.id_usuario }
          ]
        },
        transaction: t
      });

      if (funcionarioExistente) {
        await t.rollback();
        return res.status(400).json({ mensaje: 'Ya existe un Funcionario con ese documento o usuario' });
      }

      // 🔹 Crear Funcionario
      const funcionarioNuevo = await Funcionario.create({
        ...funcionario,
        numero_documento: persona.numero_documento,
        id_usuario: usuarioNuevo.id_usuario
      }, { transaction: t });

      // 🔹 Confirmar
      await t.commit();

      res.status(201).json({
        mensaje: 'Funcionario registrado con éxito',
        persona: personaNueva,
        usuario: usuarioNuevo,
        funcionario: funcionarioNuevo
      });

    } catch (error) {
      await t.rollback();
      console.error(error);
      res.status(500).json({ mensaje: 'Error al registrar funcionario', error });
    }
  }

};

module.exports = registrarFuncionarioCompleto;
