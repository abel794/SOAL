// controllers/Profesor/asistenciaController.js
const db = require("../../models");
const { Asistencia, Estudiante, Funcionario, EstadoAsistencia, GradoAsistencia, Persona } = db;

const asistenciaController = {
  /** 1. Registrar una nueva asistencia individual **/
  async registrar(req, res) {
    try {
      const { id_estudiante, id_funcionario, fecha, id_estado_asistencia, observacion, id_grado_asistencia } = req.body;

      // Validaciones de existencia
      const estudiante = await Estudiante.findByPk(id_estudiante);
      if (!estudiante) return res.status(404).json({ error: "Estudiante no encontrado" });

      const funcionario = await Funcionario.findByPk(id_funcionario);
      if (!funcionario) return res.status(404).json({ error: "Funcionario no encontrado" });

      const estado = await EstadoAsistencia.findByPk(id_estado_asistencia);
      if (!estado) return res.status(404).json({ error: "Estado de asistencia no válido" });

      const grado = await GradoAsistencia.findByPk(id_grado_asistencia);
      if (!grado) return res.status(404).json({ error: "Grado de asistencia no encontrado" });

      const nuevaAsistencia = await Asistencia.create({
        id_estudiante,
        id_funcionario,
        fecha,
        id_estado_asistencia,
        observacion,
        id_grado_asistencia
      });

      res.json({ mensaje: "✅ Asistencia registrada correctamente", data: nuevaAsistencia });
    } catch (error) {
      res.status(500).json({ error: "❌ Error al registrar asistencia", detalle: error.message });
    }
  },

  /** 2. Registrar asistencias masivas **/
 async registrarMasivo(req, res) {
  try {
    const { id_funcionario, id_grado_asistencia, fecha, asistencias } = req.body;

    if (!Array.isArray(asistencias)) {
      return res.status(400).json({ error: "El payload debe contener un array 'asistencias'" });
    }

    // Agregar datos comunes a cada asistencia
    const asistenciasPreparadas = asistencias.map(a => ({
      ...a,
      id_funcionario,
      id_grado_asistencia,
      fecha
    }));

    const nuevasAsistencias = await Asistencia.bulkCreate(asistenciasPreparadas);
    res.json({ mensaje: "✅ Asistencias registradas en bloque", data: nuevasAsistencias });
  } catch (error) {
    res.status(500).json({ error: "❌ Error al registrar asistencias masivas", detalle: error.message });
  }
},

  /** 3. Obtener todas las asistencias con detalles **/
  async obtenerTodas(req, res) {
    try {
      const asistencias = await Asistencia.findAll({
        include: [
          { model: Estudiante, include: [{ model: Persona, attributes: ["nombre", "apellido"] }] },
          { model: Funcionario, include: [{ model: Persona, attributes: ["nombre", "apellido"] }] },
          { model: EstadoAsistencia, attributes: ["nombre"] },
          { model: GradoAsistencia }
        ]
      });

      res.json(asistencias);
    } catch (error) {
      res.status(500).json({ error: "❌ Error al obtener asistencias", detalle: error.message });
    }
  },

  /** 4. Obtener con filtros **/
  async obtenerConFiltros(req, res) {
    try {
      const { id_estudiante, fecha, id_funcionario, id_estado_asistencia } = req.query;
      const where = {};

      if (id_estudiante) where.id_estudiante = id_estudiante;
      if (fecha) where.fecha = fecha;
      if (id_funcionario) where.id_funcionario = id_funcionario;
      if (id_estado_asistencia) where.id_estado_asistencia = id_estado_asistencia;

      const asistencias = await Asistencia.findAll({
        where,
        include: [
          { model: Estudiante, include: [{ model: Persona, attributes: ["nombre", "apellido"] }] },
          { model: Funcionario, include: [{ model: Persona, attributes: ["nombre", "apellido"] }] },
          { model: EstadoAsistencia, attributes: ["nombre"] },
          { model: GradoAsistencia }
        ]
      });

      res.json(asistencias);
    } catch (error) {
      res.status(500).json({ error: "❌ Error al filtrar asistencias", detalle: error.message });
    }
  },

  /** 5. Actualizar una asistencia **/
  async actualizar(req, res) {
    try {
      const { id } = req.params;
      const { id_estado_asistencia, observacion } = req.body;

      const asistencia = await Asistencia.findByPk(id);
      if (!asistencia) return res.status(404).json({ error: "Asistencia no encontrada" });

      asistencia.id_estado_asistencia = id_estado_asistencia || asistencia.id_estado_asistencia;
      asistencia.observacion = observacion || asistencia.observacion;
      await asistencia.save();

      res.json({ mensaje: "✅ Asistencia actualizada", data: asistencia });
    } catch (error) {
      res.status(500).json({ error: "❌ Error al actualizar asistencia", detalle: error.message });
    }
  },

  /** 6. Eliminar una asistencia **/
  async eliminar(req, res) {
    try {
      const { id } = req.params;
      const asistencia = await Asistencia.findByPk(id);
      if (!asistencia) return res.status(404).json({ error: "Asistencia no encontrada" });

      await asistencia.destroy();
      res.json({ mensaje: "🗑️ Asistencia eliminada correctamente" });
    } catch (error) {
      res.status(500).json({ error: "❌ Error al eliminar asistencia", detalle: error.message });
    }
  }
};

module.exports = asistenciaController;
