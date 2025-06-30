const db = require('../models');
const Justificacion = db.Justificacion;
const Estudiante = db.Estudiante;
const Persona = db.Persona;
const { Op } = require('sequelize');

const justificacionController = {

  // 🔄 Crear una justificación
  async crear(req, res) {
    try {
      const nueva = await Justificacion.create(req.body);
      res.status(201).json(nueva);
    } catch (error) {
      console.error('Error al crear justificación:', error);
      res.status(400).json({ error: 'No se pudo crear la justificación', detalle: error.message });
    }
  },

  // 📃 Listar todas las justificaciones
  async listarTodas(req, res) {
    try {
      const justificaciones = await Justificacion.findAll({
        include: {
          model: Estudiante,
          as: 'estudiante',
          include: {
            model: Persona,
            as: 'persona',
            attributes: ['primer_nombre', 'primer_apellido']
          }
        },
        order: [['fecha', 'DESC']]
      });
      res.json(justificaciones);
    } catch (error) {
      console.error('Error al obtener justificaciones:', error);
      res.status(500).json({ error: 'Error al obtener las justificaciones', detalle: error.message });
    }
  },

  // 🔍 Buscar por estudiante
  async buscarPorEstudiante(req, res) {
    const id = req.params.id;
    try {
      const resultado = await Justificacion.findAll({
        where: { id_estudiante: id },
        order: [['fecha', 'DESC']]
      });
      res.json(resultado);
    } catch (error) {
      console.error('Error al buscar por estudiante:', error);
      res.status(500).json({ error: 'Error en la consulta', detalle: error.message });
    }
  },

  // 🔎 Buscar por fecha específica o rango
  async buscarPorFecha(req, res) {
    const { desde, hasta } = req.query;
    try {
      const condiciones = {};
      if (desde && hasta) {
        condiciones.fecha = { [Op.between]: [desde, hasta] };
      } else if (desde) {
        condiciones.fecha = { [Op.gte]: desde };
      } else if (hasta) {
        condiciones.fecha = { [Op.lte]: hasta };
      }

      const resultados = await Justificacion.findAll({
        where: condiciones,
        include: {
          model: Estudiante,
          as: 'estudiante',
          include: {
            model: Persona,
            as: 'persona',
            attributes: ['primer_nombre', 'primer_apellido']
          }
        },
        order: [['fecha', 'DESC']]
      });

      res.json(resultados);
    } catch (error) {
      console.error('Error en búsqueda por fecha:', error);
      res.status(500).json({ error: 'Error en búsqueda', detalle: error.message });
    }
  }
};

module.exports = justificacionController;
