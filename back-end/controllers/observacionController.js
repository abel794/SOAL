const db = require('../models');
const {
  Observacion,
  Estudiante,
  Funcionario,
  CategoriaObservacion,
  GravedadObservacion,
  HistorialObservacion,
  Notificacion,
  Acudiente
} = db;
const { Op } = require('sequelize');

const observacionController = {
  // ✅ Contar observaciones por categoría con porcentaje
  async contarPorCategoriaConPorcentaje(req, res) {
    try {
      const total = await Observacion.count();

      if (total === 0) {
        return res.json({ mensaje: 'No hay observaciones registradas', porcentajes: {} });
      }

      const categorias = await CategoriaObservacion.findAll();
      const porcentajes = {};

      for (const categoria of categorias) {
        const cantidad = await Observacion.count({
          where: { id_categoria: categoria.id_categoria }
        });
        porcentajes[categoria.nombre_categoria] = ((cantidad / total) * 100).toFixed(1) + '%';
      }

      res.json({ total, porcentajes });
    } catch (error) {
      console.error('❌ Error al contar por categoría:', error);
      res.status(500).json({ error: 'Error al calcular porcentajes por categoría', detalle: error.message });
    }
  },

  // ✅ Crear observación + notificación automática
  async crear(req, res) {
    const t = await db.sequelize.transaction();
    try {
      const nueva = await Observacion.create(req.body, { transaction: t });

      const estudiante = await Estudiante.findByPk(req.body.id_estudiante, {
        include: [{ model: Acudiente, as: 'acudiente' }]
      });

      if (!estudiante || !estudiante.acudiente) {
        await t.rollback();
        return res.status(404).json({ error: 'Acudiente no encontrado para el estudiante' });
      }

      await Notificacion.create({
        id_acudiente: estudiante.acudiente.id_acudiente,
        mensaje: 'Se ha registrado una observación para su acudido. Por favor, revísela.',
        id_canal: 1,
        id_estado_notificacion: 1
      }, { transaction: t });

      await t.commit();
      res.status(201).json(nueva);
    } catch (error) {
      await t.rollback();
      console.error('❌ Error al crear observación y notificación:', error);
      res.status(500).json({ error: 'Error al crear observación', detalle: error.message });
    }
  },

  // ✅ Listar observaciones con todos los detalles
  async listarConDetalles(req, res) {
    try {
      const observaciones = await Observacion.findAll({
        include: [
          { model: Estudiante, as: 'estudiante', include: ['persona'] },
          { model: Funcionario, as: 'funcionario', include: ['persona'] },
          { model: CategoriaObservacion, as: 'categoria' },
          { model: GravedadObservacion, as: 'gravedad' }
        ]
      });

      const resultado = observaciones.map(obs => ({
        estudiante: obs.estudiante?.persona?.nombre || 'No disponible',
        tipo: obs.categoria?.nombre_categoria,
        profesor: obs.funcionario?.persona?.nombre || 'No disponible',
        fecha: obs.fecha,
        gravedad: obs.gravedad?.nombre,
        observacion: obs.descripcion
      }));

      res.json(resultado);
    } catch (error) {
      console.error('❌ Error al listar observaciones detalladas:', error);
      res.status(500).json({ error: 'Error al listar observaciones', detalle: error.message });
    }
  },

  // ✅ Obtener por ID
  async obtenerPorId(req, res) {
    try {
      const obs = await Observacion.findByPk(req.params.id);
      if (!obs) return res.status(404).json({ error: 'Observación no encontrada' });
      res.json(obs);
    } catch (error) {
      console.error("❌ Error al obtener observación por ID:", error);
      res.status(500).json({ error: 'Error al buscar observación', detalle: error.message });
    }
  },

  // ✅ Eliminar observación
  async eliminar(req, res) {
    try {
      const eliminado = await Observacion.destroy({ where: { id_observacion: req.params.id } });
      if (!eliminado) return res.status(404).json({ error: 'Observación no encontrada' });
      res.json({ mensaje: 'Observación eliminada correctamente' });
    } catch (error) {
      console.error("❌ Error al eliminar observación:", error);
      res.status(500).json({ error: 'Error al eliminar', detalle: error.message });
    }
  },

  // ✅ Actualizar y guardar historial
  async actualizar(req, res) {
    const id = req.params.id;
    const { descripcion } = req.body;

    try {
      const [actualizado] = await Observacion.update(req.body, { where: { id_observacion: id } });
      if (actualizado === 0) return res.status(404).json({ error: 'No encontrada o sin cambios' });

      await HistorialObservacion.create({
        id_observacion: id,
        descripcion_modificacion: descripcion || 'Modificación general',
        fecha_modificacion: new Date() // ✅ Establece la fecha actual
      });

      res.json({ mensaje: 'Observación actualizada y registrada en historial' });
    } catch (error) {
      console.error("❌ Error al actualizar observación:", error);
      res.status(400).json({ error: 'Error al actualizar', detalle: error.message });
    }
  },

  // ✅ Contar total de observaciones
  async contarObservaciones(req, res) {
    try {
      const total = await Observacion.count();
      res.json({ totalObservaciones: total });
    } catch (error) {
      console.error("❌ Error al contar observaciones:", error);
      res.status(500).json({ error: 'Error al contar', detalle: error.message });
    }
  },

  // ✅ Contar por gravedad
  // ✅ Contar por gravedad (Leve, Moderado, Grave)
async contarPorGravedad(req, res) {
  try {
    const total = await Observacion.count();

    const gravedadLabels = ['Leve', 'Moderado', 'Grave'];
    const porcentajes = {
      Leve: '0.0%',
      Moderado: '0.0%',
      Grave: '0.0%'
    };

    if (total === 0) {
      return res.json({ total, porcentajes });
    }

    const gravedades = await GravedadObservacion.findAll();

    for (const g of gravedades) {
      const cantidad = await Observacion.count({
        where: { id_gravedad: g.id_gravedad }
      });

      const nombreGravedad = g.get('nombre')?.trim(); // ✅ Evita undefined

      if (gravedadLabels.includes(nombreGravedad)) {
        porcentajes[nombreGravedad] = ((cantidad / total) * 100).toFixed(1) + '%';
      } else {
        console.warn(`⚠️ Gravedad desconocida ignorada: ${nombreGravedad}`);
      }
    }

    res.json({ total, porcentajes });
  } catch (error) {
    console.error("❌ Error al contar por gravedad:", error);
    res.status(500).json({ error: 'Error al contar por gravedad', detalle: error.message });
  }
},

  // ✅ Contar por tipo de observación
  // ✅ Contar por tipo de observación (solo cantidades, sin porcentaje)
async contarPorTipo(req, res) {
  try {
    const categorias = await CategoriaObservacion.findAll();
    const resultados = {};

    for (const categoria of categorias) {
      const cantidad = await Observacion.count({
        where: { id_categoria: categoria.id_categoria }
      });

      // ✅ Usa el campo correcto según tu modelo (nombre)
      const nombre = categoria.nombre;
      resultados[nombre] = cantidad;
    }

    res.json(resultados);
  } catch (error) {
    console.error("❌ Error al contar por tipo:", error);
    res.status(500).json({ error: 'Error al contar por tipo', detalle: error.message });
  }
},

  // ✅ Contar críticas (disciplinarias)
  async contarCriticos(req, res) {
    try {
      const categoria = await CategoriaObservacion.findOne({ where: { nombre: 'Disciplinaria' } });

      if (!categoria) {
        return res.status(404).json({ error: 'Categoría Disciplinaria no encontrada' });
      }

      const total = await Observacion.count({ where: { id_categoria: categoria.id_categoria } });
      res.json({ observacionesCriticas: total });
    } catch (error) {
      console.error("❌ Error al contar críticas:", error);
      res.status(500).json({ error: 'Error al contar críticas', detalle: error.message });
    }
  }
};

module.exports = observacionController;

