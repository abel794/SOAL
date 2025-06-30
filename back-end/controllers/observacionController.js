const db = require('../models');
const { Observacion, Estudiante, Funcionario, CategoriaObservacion, GravedadObservacion, HistorialObservacion, Notificacion, Acudiente } = db;
const { Op } = require('sequelize');

const observacionController = {

  // 📊 Contar porcentaje de observaciones por categoría (tipo)
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


  // ✅ Crear una observación y notificar al acudiente
  async crear(req, res) {
    const t = await db.sequelize.transaction();
    try {
      // 1. Crear observación
      const nueva = await Observacion.create(req.body, { transaction: t });

      // 2. Buscar estudiante con su acudiente
      const estudiante = await Estudiante.findByPk(req.body.id_estudiante, {
        include: [{ model: Acudiente, as: 'acudiente' }]
      });

      if (!estudiante || !estudiante.acudiente) {
        await t.rollback();
        return res.status(404).json({ error: 'Acudiente no encontrado' });
      }

      // 3. Crear notificación
      await Notificacion.create({
        id_acudiente: estudiante.acudiente.id_acudiente,
        mensaje: 'Se ha registrado una observación para su acudido. Por favor, revísela.',
        id_canal: 1, // reemplazar con ID válido del canal (ej. WhatsApp)
        id_estado_notificacion: 1 // estado inicial (ej. pendiente)
      }, { transaction: t });

      await t.commit();
      res.status(201).json(nueva);
    } catch (error) {
      await t.rollback();
      console.error('Error al crear observación y notificación:', error);
      res.status(500).json({ error: 'Error al crear observación', detalle: error.message });
    }
  },

  // ✅ Listar observaciones con detalles completos
  async listarConDetalles(req, res) {
    try {
      const observaciones = await Observacion.findAll({
        include: [
          { model: Estudiante, as: 'estudiante', attributes: ['id_estudiante'], include: ['persona'] },
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
      console.error('Error al listar observaciones detalladas:', error);
      res.status(500).json({ error: 'Error al listar observaciones' });
    }
  },

  // ✅ Obtener una observación por ID
  async obtenerPorId(req, res) {
    try {
      const obs = await Observacion.findByPk(req.params.id);
      if (!obs) return res.status(404).json({ error: 'Observación no encontrada' });
      res.json(obs);
    } catch (error) {
      res.status(500).json({ error: 'Error al buscar observación' });
    }
  },

  // ✅ Eliminar observación
  async eliminar(req, res) {
    try {
      const eliminado = await Observacion.destroy({ where: { id_observacion: req.params.id } });
      if (!eliminado) return res.status(404).json({ error: 'No encontrada' });
      res.json({ mensaje: 'Observación eliminada' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar' });
    }
  },

  // ✅ Actualizar observación y guardar historial
  async actualizar(req, res) {
    const id = req.params.id;
    const { descripcion } = req.body;

    try {
      const [actualizado] = await Observacion.update(req.body, { where: { id_observacion: id } });

      if (actualizado === 0) return res.status(404).json({ error: 'No encontrada o sin cambios' });

      // Registrar historial de modificación
      await HistorialObservacion.create({
        id_observacion: id,
        descripcion_modificacion: descripcion || 'Modificación general'
      });

      res.json({ mensaje: 'Observación actualizada y registrada en historial' });
    } catch (error) {
      res.status(400).json({ error: 'Error al actualizar', detalle: error.message });
    }
  },

  // ✅ Total de observaciones
  async contarObservaciones(req, res) {
    try {
      const total = await Observacion.count();
      res.json({ totalObservaciones: total });
    } catch (error) {
      res.status(500).json({ error: 'Error al contar' });
    }
  },

  // ✅ Contar observaciones por gravedad
  async contarPorGravedad(req, res) {
    try {
      const total = await Observacion.count();
      const gravedades = await GravedadObservacion.findAll();

      const porcentajes = {};
      for (const g of gravedades) {
        const cantidad = await Observacion.count({ where: { id_gravedad: g.id_gravedad } });
        porcentajes[g.nombre] = ((cantidad / total) * 100).toFixed(1) + '%';
      }

      res.json({ total, porcentajes });
    } catch (error) {
      res.status(500).json({ error: 'Error al contar por gravedad' });
    }
  },

  // ✅ Contar por tipo de observación (categoría)
  async contarPorTipo(req, res) {
    try {
      const categorias = await CategoriaObservacion.findAll();

      const resultados = {};
      for (const categoria of categorias) {
        const cantidad = await Observacion.count({ where: { id_categoria: categoria.id_categoria } });
        resultados[categoria.nombre_categoria] = cantidad;
      }

      res.json(resultados);
    } catch (error) {
      res.status(500).json({ error: 'Error al contar por tipo' });
    }
  },

  // ✅ Contar observaciones disciplinarias
  async contarCriticos(req, res) {
    try {
      const categoria = await CategoriaObservacion.findOne({ where: { nombre_categoria: 'Disciplinaria' } });
      if (!categoria) return res.status(404).json({ error: 'Categoría crítica no encontrada' });

      const total = await Observacion.count({ where: { id_categoria: categoria.id_categoria } });
      res.json({ observacionesCriticas: total });
    } catch (error) {
      res.status(500).json({ error: 'Error al contar críticas' });
    }
  }

};

module.exports = observacionController;

