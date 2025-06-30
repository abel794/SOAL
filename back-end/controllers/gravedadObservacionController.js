const db = require('../models');
const Gravedad = db.GravedadObservacion;
const Observacion = db.Observacion;
const { Op } = require('sequelize');

const gravedadController = {

  // ✅ Listar todas las gravedades
  async listarTodos(req, res) {
    try {
      const resultados = await Gravedad.findAll();
      res.json(resultados);
    } catch (error) {
      console.error("Error al listar gravedades:", error);
      res.status(500).json({ error: 'Error al listar gravedades', detalle: error.message });
    }
  },


  // 📊 Obtener porcentaje de observaciones por gravedad
async porcentajePorGravedad(req, res) {
  try {
    // Traer todos los niveles de gravedad y contar observaciones asociadas
    const gravedades = await db.GravedadObservacion.findAll({
      include: [
        {
          model: db.Observacion,
          as: 'observaciones',
          attributes: []
        }
      ],
      attributes: [
        'nombre',
        [db.sequelize.fn('COUNT', db.sequelize.col('observaciones.id_observacion')), 'total']
      ],
      group: ['GravedadObservacion.id_gravedad']
    });

    // Obtener total de observaciones generales
    const totalGeneral = await db.Observacion.count();

    // Calcular porcentaje
    const resultado = gravedades.map(g => {
      const total = parseInt(g.dataValues.total || 0);
      const porcentaje = totalGeneral > 0 ? ((total / totalGeneral) * 100).toFixed(2) : 0;
      return {
        gravedad: g.nombre,
        cantidad: total,
        porcentaje: `${porcentaje}%`
      };
    });

    res.json({
      total_observaciones: totalGeneral,
      resumen: resultado
    });
  } catch (error) {
    console.error("Error al calcular porcentajes por gravedad:", error);
    res.status(500).json({ error: 'Error al calcular porcentajes', detalle: error.message });
  }
},


  // 🔍 Buscar gravedad por nombre
  async buscarPorNombre(req, res) {
    const { nombre } = req.query;

    if (!nombre) {
      return res.status(400).json({ error: 'Debe enviar el parámetro "nombre"' });
    }

    try {
      const resultados = await Gravedad.findAll({
        where: {
          nombre: { [Op.like]: `%${nombre}%` }
        }
      });

      if (resultados.length === 0) {
        return res.status(404).json({ mensaje: 'No se encontraron coincidencias' });
      }

      res.json(resultados);
    } catch (error) {
      console.error("Error en buscarPorNombre:", error);
      res.status(500).json({ error: 'Error al buscar gravedad', detalle: error.message });
    }
  },

  // 🧮 Contar cuántas gravedades existen
  async contar(req, res) {
    try {
      const total = await Gravedad.count();
      res.json({ total });
    } catch (error) {
      console.error("Error al contar gravedades:", error);
      res.status(500).json({ error: 'Error al contar gravedades', detalle: error.message });
    }
  },

  // 📝 Crear nueva gravedad
  async crear(req, res) {
    try {
      const nueva = await Gravedad.create(req.body);
      res.status(201).json(nueva);
    } catch (error) {
      console.error("Error al crear gravedad:", error);
      res.status(400).json({ error: 'Error al crear gravedad', detalle: error.message });
    }
  },

  // ✏️ Actualizar una gravedad
  async actualizar(req, res) {
    const id = req.params.id;
    try {
      const [filas] = await Gravedad.update(req.body, {
        where: { id_gravedad: id }
      });

      if (filas === 0) {
        return res.status(404).json({ error: 'Gravedad no encontrada o sin cambios' });
      }

      res.json({ mensaje: 'Gravedad actualizada correctamente' });
    } catch (error) {
      console.error("Error al actualizar gravedad:", error);
      res.status(400).json({ error: 'Error al actualizar gravedad', detalle: error.message });
    }
  },

  // 🗑️ Eliminar gravedad
  async eliminar(req, res) {
    const id = req.params.id;
    try {
      const borrado = await Gravedad.destroy({
        where: { id_gravedad: id }
      });

      if (borrado === 0) {
        return res.status(404).json({ error: 'Gravedad no encontrada' });
      }

      res.json({ mensaje: 'Gravedad eliminada correctamente' });
    } catch (error) {
      console.error("Error al eliminar gravedad:", error);
      res.status(500).json({ error: 'Error al eliminar gravedad', detalle: error.message });
    }
  },

  // 📋 Ver observaciones asociadas a un nivel de gravedad
  async observacionesPorGravedad(req, res) {
    const id = req.params.id;

    try {
      const gravedad = await Gravedad.findByPk(id, {
        include: [{ model: Observacion, as: 'observaciones' }]
      });

      if (!gravedad) {
        return res.status(404).json({ error: 'Gravedad no encontrada' });
      }

      res.json(gravedad);
    } catch (error) {
      console.error("Error al obtener observaciones por gravedad:", error);
      res.status(500).json({ error: 'Error al obtener observaciones', detalle: error.message });
    }
  }

};

module.exports = gravedadController;
