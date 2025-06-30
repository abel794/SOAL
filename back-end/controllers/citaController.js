const db = require('../models');
const { Cita, Estudiante, Acudiente, Persona, Funcionario, Usuario, EstadoUsuario } = db;
const { Op } = require('sequelize');

const citaController = {
  // ✅ Crear una nueva cita
  async crearCita(req, res) {
    try {
      const nuevaCita = await Cita.create(req.body);
      res.status(201).json({ mensaje: 'Cita creada', cita: nuevaCita });
    } catch (error) {
      console.error('Error al crear cita:', error);
      res.status(500).json({ mensaje: 'Error al crear cita', detalle: error.message });
    }
  },

  // ✅ Obtener todas las citas sin error de columna inexistente
  async obtenerCitas(req, res) {
    try {
      const citas = await Cita.findAll({
        include: [
          {
            model: Estudiante,
            as: 'estudiante',
            include: [
              {
                model: Persona,
                as: 'persona'
              }
            ]
          },
          {
            model: Acudiente,
            as: 'acudiente',
            include: [
              {
                model: Persona,
                as: 'persona'
              }
            ]
          },
          {
            model: Funcionario,
            as: 'funcionario',
            include: [
              {
                model: Usuario,
                as: 'usuario',
                include: [
                  {
                    model: EstadoUsuario,
                    as: 'estado' // ⚠️ Asociación válida desde Usuario
                  }
                ]
              }
              // ❌ Se eliminó la relación funcionario.estadoUsuario
            ]
          }
        ]
      });

      res.json(citas);
    } catch (error) {
      console.error('Error al obtener citas:', error);
      res.status(500).json({ mensaje: 'Error al obtener citas', detalle: error.message });
    }
  },

  // ✅ Contar total de citas
  async contarCitas(req, res) {
    try {
      const total = await Cita.count();
      res.json({ totalCitas: total });
    } catch (error) {
      console.error('Error al contar citas:', error);
      res.status(500).json({ mensaje: 'Error al contar citas' });
    }
  },

  // 🔍 Buscar citas por número de documento del estudiante o acudiente
  async buscarPorDocumento(req, res) {
    const { documento } = req.query;
    if (!documento) {
      return res.status(400).json({ mensaje: 'Debe enviar el parámetro ?documento=' });
    }

    try {
      const citas = await Cita.findAll({
        include: [
          {
            model: Estudiante,
            as: 'estudiante',
            include: {
              model: Persona,
              as: 'persona',
              where: { numero_documento: documento }
            }
          },
          {
            model: Acudiente,
            as: 'acudiente',
            include: {
              model: Persona,
              as: 'persona',
              where: { numero_documento: documento }
            }
          }
        ]
      });

      if (citas.length === 0) {
        return res.status(404).json({ mensaje: 'No se encontraron citas' });
      }

      res.json({ total: citas.length, citas });
    } catch (error) {
      console.error('Error al buscar por documento:', error);
      res.status(500).json({ mensaje: 'Error al buscar por documento' });
    }
  },

  // 🔍 Buscar citas por nombre del estudiante o acudiente
  async buscarPorNombre(req, res) {
    const { nombre } = req.query;
    if (!nombre) {
      return res.status(400).json({ mensaje: 'Debe enviar el parámetro ?nombre=' });
    }

    try {
      const citas = await Cita.findAll({
        include: [
          {
            model: Estudiante,
            as: 'estudiante',
            include: {
              model: Persona,
              as: 'persona',
              where: {
                nombre: { [Op.like]: `%${nombre}%` }
              }
            }
          },
          {
            model: Acudiente,
            as: 'acudiente',
            include: {
              model: Persona,
              as: 'persona',
              where: {
                nombre: { [Op.like]: `%${nombre}%` }
              }
            }
          }
        ]
      });

      if (citas.length === 0) {
        return res.status(404).json({ mensaje: 'No se encontraron citas' });
      }

      res.json({ total: citas.length, citas });
    } catch (error) {
      console.error('Error al buscar por nombre:', error);
      res.status(500).json({ mensaje: 'Error al buscar por nombre' });
    }
  }
};

module.exports = citaController;
