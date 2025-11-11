const db = require('../../models');
const { Op } = require('sequelize');

const Persona = db.Persona;
const Usuario = db.Usuario;
const Acudiente = db.Acudiente;

const registrarAcudienteCompleto = {

  async registrarTodo(req, res) {
    const t = await db.sequelize.transaction();

    try {
      const { persona, usuario, acudiente } = req.body;

      // 🔹 Validar si ya existe Persona
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

      // 🔹 Validar si ya existe Usuario
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
        return res.status(400).json({ mensaje: 'El username o número de documento ya está en Usuario' });
      }

      // 🔹 Crear Usuario (conecta con documento de persona)
      const usuarioNuevo = await Usuario.create({
        ...usuario,
        numero_documento: persona.numero_documento
      }, { transaction: t });

      // 🔹 Validar si ya existe Acudiente
      const acudienteExistente = await Acudiente.findOne({
        where: {
          [Op.or]: [
            { numero_documento: persona.numero_documento },
            { id_usuario: usuarioNuevo.id_usuario }
          ]
        },
        transaction: t
      });

      if (acudienteExistente) {
        await t.rollback();
        return res.status(400).json({ mensaje: 'Ya existe un acudiente con ese documento o usuario' });
      }

      // 🔹 Crear Acudiente
      const acudienteNuevo = await Acudiente.create({
        ...acudiente,
        numero_documento: persona.numero_documento,
        id_usuario: usuarioNuevo.id_usuario
      }, { transaction: t });

      // 🔹 Confirmar transacción
      await t.commit();

      res.status(201).json({
        mensaje: 'Acudiente registrado con éxito',
        persona: personaNueva,
        usuario: usuarioNuevo,
        acudiente: acudienteNuevo
      });

    } catch (error) {
      await t.rollback();
      console.error(error);
      res.status(500).json({ mensaje: 'Error al registrar acudiente', error });
    }
  }

};

module.exports = registrarAcudienteCompleto;

