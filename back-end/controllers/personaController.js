const db = require('../models');
const { Persona, Sexo, TipoDocumento, Funcionario, Estudiante, Acudiente } = db;
const { Op } = require('sequelize');

const personaController = {

  // ✅ Obtener todas las personas con relaciones
  async listarTodas(req, res) {
    try {
      const personas = await Persona.findAll({
        include: [
          { model: Sexo, as: 'sexo', attributes: ['nombre'] },
          { model: TipoDocumento, as: 'tipoDocumento', attributes: ['nombre'] },
          { model: Funcionario, as: 'funcionario', attributes: ['id_funcionario', 'cargo'] },
          { model: Estudiante, as: 'estudiante', attributes: ['id_estudiante', 'id_eps'] },
          { model: Acudiente, as: 'acudiente', attributes: ['id_acudiente', 'id_relacion'] },
        ]
      });
      res.json(personas);
    } catch (error) {
      console.error('Error al listar personas:', error);
      res.status(500).json({ error: 'Error al obtener las personas', detalle: error.message });
    }
  },

  // ✅ Obtener persona por ID (número_documento)
  async obtenerPorDocumento(req, res) {
    const documento = req.params.documento;
    try {
      const persona = await Persona.findByPk(documento, {
        include: [
          { model: Sexo, as: 'sexo', attributes: ['nombre'] },
          { model: TipoDocumento, as: 'tipoDocumento', attributes: ['nombre'] },
          { model: Funcionario, as: 'funcionario', attributes: ['id_funcionario', 'cargo'] },
          { model: Estudiante, as: 'estudiante', attributes: ['id_estudiante', 'id_eps'] },
          { model: Acudiente, as: 'acudiente', attributes: ['id_acudiente', 'id_relacion'] },
        ]
      });

      if (!persona) {
        return res.status(404).json({ error: 'Persona no encontrada' });
      }

      res.json(persona);
    } catch (error) {
      console.error('Error al obtener persona:', error);
      res.status(500).json({ error: 'Error al buscar la persona', detalle: error.message });
    }
  },

  // ✅ Crear nueva persona
  async crear(req, res) {
    try {
      const nueva = await Persona.create(req.body);
      res.status(201).json(nueva);
    } catch (error) {
      console.error('Error al crear persona:', error);
      res.status(400).json({ error: 'Error al crear la persona', detalle: error.message });
    }
  },

  // ✅ Actualizar persona
  async actualizar(req, res) {
    const documento = req.params.documento;
    try {
      const [actualizadas] = await Persona.update(req.body, {
        where: { numero_documento: documento }
      });

      if (actualizadas === 0) {
        return res.status(404).json({ error: 'Persona no encontrada o sin cambios' });
      }

      res.json({ mensaje: 'Persona actualizada correctamente' });
    } catch (error) {
      console.error('Error al actualizar persona:', error);
      res.status(400).json({ error: 'Error al actualizar la persona', detalle: error.message });
    }
  },

  // ✅ Eliminar persona
  async eliminar(req, res) {
    const documento = req.params.documento;
    try {
      const eliminadas = await Persona.destroy({
        where: { numero_documento: documento }
      });

      if (eliminadas === 0) {
        return res.status(404).json({ error: 'Persona no encontrada' });
      }

      res.json({ mensaje: 'Persona eliminada correctamente' });
    } catch (error) {
      console.error('Error al eliminar persona:', error);
      res.status(500).json({ error: 'Error al eliminar la persona', detalle: error.message });
    }
  },

  // 🔍 Buscar personas por nombre o apellido
  async buscarPorNombre(req, res) {
    const { nombre } = req.query;
    if (!nombre) {
      return res.status(400).json({ error: 'Debe proporcionar el nombre para buscar' });
    }

    try {
      const personas = await Persona.findAll({
        where: {
          [Op.or]: [
            { nombre: { [Op.like]: `%${nombre}%` } },
            { apellido: { [Op.like]: `%${nombre}%` } }
          ]
        },
        include: [
          { model: Sexo, as: 'sexo', attributes: ['nombre'] },
          { model: TipoDocumento, as: 'tipoDocumento', attributes: ['nombre'] }
        ]
      });

      if (personas.length === 0) {
        return res.status(404).json({ mensaje: 'No se encontraron coincidencias' });
      }

      res.json(personas);
    } catch (error) {
      console.error('Error en buscarPorNombre:', error);
      res.status(500).json({ error: 'Error al buscar personas', detalle: error.message });
    }
  }

};

module.exports = personaController;
