const db = require('../models');
const Historial = db.HistorialObservacion;
const Observacion = db.Observacion;
const Funcionario = db.Funcionario;
const Persona = db.Persona;
const { Op } = require('sequelize');

const historialController = {

  // ✅ Crear historial de una modificación
  async crear(req, res) {
    try {
      const { id_observacion, descripcion_modificacion } = req.body;

      if (!id_observacion) {
        return res.status(400).json({ error: 'El campo id_observacion es obligatorio.' });
      }

      const nuevo = await Historial.create({
        id_observacion,
        descripcion_modificacion,
        fecha_modificacion: new Date()
      });

      res.status(201).json(nuevo);
    } catch (error) {
      console.error("Error al crear historial:", error);
      res.status(500).json({ error: 'Error al registrar historial', detalle: error.message });
    }
  },

  // 🔍 Obtener historial por ID del estudiante
  async obtenerPorEstudiante(req, res) {
    const { id_estudiante } = req.params;

    try {
      const historiales = await Historial.findAll({
        include: {
          model: Observacion,
          as: 'observacion',
          where: { id_estudiante }
        },
        order: [['fecha_modificacion', 'DESC']]
      });

      if (historiales.length === 0) {
        return res.status(404).json({ mensaje: 'No hay historial para este estudiante' });
      }

      res.json(historiales);
    } catch (error) {
      console.error("Error al obtener historial por estudiante:", error);
      res.status(500).json({ error: 'Error al consultar historial por estudiante', detalle: error.message });
    }
  },

  // 🔍 Buscar historial por nombre del estudiante
async buscarPorNombreEstudiante(req, res) {
  const { nombre } = req.query;

  try {
    const historiales = await Historial.findAll({
      include: {
        model: Observacion,
        as: 'observacion',
        include: {
          model: db.Estudiante,
          as: 'estudiante',
          include: {
            model: db.Persona,
            as: 'persona',
            where: {
              [Op.or]: [
                { nombre: { [Op.like]: `%${nombre}%` } },
                { apellido: { [Op.like]: `%${nombre}%` } }
              ]
            },
            attributes: ['nombre', 'apellido']
          }
        }
      },
      order: [['fecha_modificacion', 'DESC']]
    });

    if (historiales.length === 0) {
      return res.status(404).json({ mensaje: 'No se encontraron coincidencias con el nombre del estudiante' });
    }

    res.json(historiales);
  } catch (error) {
    console.error("Error al buscar historial por nombre de estudiante:", error);
    res.status(500).json({ error: 'Error al buscar historial por nombre', detalle: error.message });
  }
},


  // 🔍 Buscar historial por nombre del estudiante
  async historialPorNombreEstudiante(req, res) {
    const { nombre } = req.query;

    try {
      const historiales = await Historial.findAll({
        include: {
          model: Observacion,
          as: 'observacion',
          include: {
            model: Funcionario,
            as: 'funcionario',
            include: {
              model: Persona,
              as: 'persona',
              where: {
                [Op.or]: [
                  { nombre: { [Op.like]: `%${nombre}%` } },
                  { apellido: { [Op.like]: `%${nombre}%` } }
                ]
              },
              attributes: ['nombre', 'apellido']
            }
          }
        },
        order: [['fecha_modificacion', 'DESC']]
      });

      if (historiales.length === 0) {
        return res.status(404).json({ mensaje: 'No se encontraron coincidencias con el nombre del estudiante' });
      }

      res.json(historiales);
    } catch (error) {
      console.error("Error al buscar por nombre del estudiante:", error);
      res.status(500).json({ error: 'Error al buscar historial por estudiante', detalle: error.message });
    }
  },

  // ✅ Listar todos los historiales
  async listarTodos(req, res) {
    try {
      const historiales = await Historial.findAll({
        include: {
          model: Observacion,
          as: 'observacion',
          include: {
            model: Funcionario,
            as: 'funcionario',
            include: {
              model: Persona,
              as: 'persona',
              attributes: ['nombre', 'apellido']
            }
          }
        },
        order: [['fecha_modificacion', 'DESC']]
      });
      res.json(historiales);
    } catch (error) {
      console.error("Error al listar historial:", error);
      res.status(500).json({ error: 'Error al obtener historial', detalle: error.message });
    }
  },

  // ✅ Ver historial por observación específica
  async historialPorObservacion(req, res) {
    const { id } = req.params;

    try {
      const historial = await Historial.findAll({
        where: { id_observacion: id },
        order: [['fecha_modificacion', 'DESC']]
      });

      if (historial.length === 0) {
        return res.status(404).json({ mensaje: 'No hay historial para esta observación' });
      }

      res.json(historial);
    } catch (error) {
      console.error("Error al consultar historial:", error);
      res.status(500).json({ error: 'Error al consultar historial', detalle: error.message });
    }
  },

  // 🔍 Buscar historial por rango de fecha
  async buscarPorFecha(req, res) {
    const { desde, hasta } = req.query;

    try {
      const historiales = await Historial.findAll({
        where: {
          fecha_modificacion: {
            [Op.between]: [new Date(desde), new Date(hasta)]
          }
        },
        include: {
          model: Observacion,
          as: 'observacion'
        },
        order: [['fecha_modificacion', 'DESC']]
      });

      res.json(historiales);
    } catch (error) {
      console.error("Error al buscar por fecha:", error);
      res.status(500).json({ error: 'Error en búsqueda por fechas', detalle: error.message });
    }
  },

  // 🔍 Buscar historial por nombre del profesor
  async buscarPorNombreProfesor(req, res) {
    const { nombre } = req.query;

    try {
      const historiales = await Historial.findAll({
        include: {
          model: Observacion,
          as: 'observacion',
          include: {
            model: Funcionario,
            as: 'funcionario',
            include: {
              model: Persona,
              as: 'persona',
              where: {
                [Op.or]: [
                  { nombre: { [Op.like]: `%${nombre}%` } },
                  { apellido: { [Op.like]: `%${nombre}%` } }
                ]
              },
              attributes: ['nombre', 'apellido']
            }
          }
        },
        order: [['fecha_modificacion', 'DESC']]
      });

      if (historiales.length === 0) {
        return res.status(404).json({ mensaje: 'No se encontraron coincidencias con el nombre del profesor' });
      }

      res.json(historiales);
    } catch (error) {
      console.error("Error al buscar por nombre de profesor:", error);
      res.status(500).json({ error: 'Error al buscar historial por profesor', detalle: error.message });
    }
  },

  // 🔍 Obtener historial por ID
  async obtenerPorId(req, res) {
    const { id } = req.params;

    try {
      const historial = await Historial.findByPk(id, {
        include: {
          model: Observacion,
          as: 'observacion'
        }
      });

      if (!historial) {
        return res.status(404).json({ error: 'Historial no encontrado' });
      }

      res.json(historial);
    } catch (error) {
      console.error("Error al obtener historial por ID:", error);
      res.status(500).json({ error: 'Error al consultar historial', detalle: error.message });
    }
  },

  // ❌ Eliminar historial
  async eliminar(req, res) {
    const { id } = req.params;

    try {
      const eliminado = await Historial.destroy({ where: { id_historial: id } });

      if (eliminado === 0) {
        return res.status(404).json({ error: 'Historial no encontrado para eliminar' });
      }

      res.json({ mensaje: 'Historial eliminado correctamente' });
    } catch (error) {
      console.error("Error al eliminar historial:", error);
      res.status(500).json({ error: 'Error al eliminar historial', detalle: error.message });
    }
  }

};

module.exports = historialController;
