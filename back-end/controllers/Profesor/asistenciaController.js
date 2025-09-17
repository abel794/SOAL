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
    const { id_funcionario, id_grado, fecha, asistencias } = req.body;

    if (!Array.isArray(asistencias)) {
      return res.status(400).json({ error: "El payload debe contener un array 'asistencias'" });
    }
      // Crear registro en grado_asistencia
    const gradoAsistencia = await GradoAsistencia.create({
      id_funcionario,
      id_grado,
      fecha
    });
    

    // Agregar datos comunes a cada asistencia
    const asistenciasPreparadas = asistencias.map(a => ({
      ...a,
      id_funcionario,
      id_grado_asistencia: gradoAsistencia.id_grado_asistencia,
      fecha
    }));

    const nuevasAsistencias = await Asistencia.bulkCreate(asistenciasPreparadas);
    res.json({ mensaje: "✅ Asistencias registradas en bloque", data: nuevasAsistencias, gradoAsistencia });
  } catch (error) {
    res.status(500).json({ error: "❌ Error al registrar asistencias masivas", detalle: error.message });
  }
},

  /** 3. Obtener todas las asistencias con detalles **/
  async obtenerTodas(req, res) {
  try {
    const asistencias = await Asistencia.findAll({
      include: [
        { 
          model: Estudiante, 
          as: "estudiante",
          include: [{ model: Persona, as: "persona", attributes: ["nombre", "apellido"] }]
        },
        { 
          model: Funcionario, 
          as: "funcionario",
          include: [{ model: Persona, as: "persona", attributes: ["nombre", "apellido"] }]
        },
        { model: EstadoAsistencia, as: "estadoAsistencia", attributes: ["nombre"] },
        { 
          model: GradoAsistencia, 
          as: "gradoAsistencia",
          include: [{ model: db.Grado, as: "grado", attributes: ["nombre_grado"] }]
        }
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
    const { id_estudiante, fecha, id_funcionario, id_estado_asistencia, nombre, apellido, grado } = req.query;
    const where = {};

    // Filtros directos
    if (id_estudiante) where.id_estudiante = id_estudiante;
    if (fecha) where.fecha = fecha;
    if (id_funcionario) where.id_funcionario = id_funcionario;
    if (id_estado_asistencia) where.id_estado_asistencia = id_estado_asistencia;

    // Construcción de include dinámico
    const include = [
      { 
        model: Estudiante, 
        as: "estudiante", 
        include: [
          { 
            model: Persona, 
            as: "persona", 
            attributes: ["nombre", "apellido"],
            where: {} // 👈 para filtrar nombre/apellido
          }
        ]
      },
      { 
        model: Funcionario, 
        as: "funcionario", 
        include: [{ model: Persona, as: "persona", attributes: ["nombre", "apellido"] }] 
      },
      { 
        model: EstadoAsistencia, 
        as: "estadoAsistencia", 
        attributes: ["nombre"] 
      },
      { 
        model: GradoAsistencia, 
        as: "gradoAsistencia",
        include: [
          { model: db.Grado, as: "grado", attributes: ["nombre_grado"], where: {} } // 👈 para filtrar grado
        ]
      }
    ];

    // Filtros avanzados
    if (nombre) include[0].include[0].where.nombre = nombre;
    if (apellido) include[0].include[0].where.apellido = apellido;
    if (grado) include[3].include[0].where.nombre_grado = grado;

    const asistencias = await Asistencia.findAll({
      where,
      include
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
  },
 /** 7. Historial por profesor **/
// controllers/Profesor/asistenciasController.js
async historialPorProfesor(req, res) {
  try {
    const { id } = req.params;

    const asistencias = await Asistencia.findAll({
      where: { id_funcionario: id },
      attributes: ["id_asistencia", "fecha", "observacion"], // solo lo esencial
      include: [
        { 
          model: Estudiante, 
          as: "estudiante",
          attributes: ["id_estudiante", "numero_documento"],
          include: [
            { 
              model: Persona, 
              as: "persona", 
              attributes: ["nombre", "apellido"] 
            }
          ]
        },
        { 
          model: EstadoAsistencia, 
          as: "estadoAsistencia", 
          attributes: ["nombre"] 
        },
        { 
          model: GradoAsistencia, 
          as: "gradoAsistencia",
          attributes: ["id_grado_asistencia"], // ocultamos id's de la tabla pivote
          include:[ 
            { 
              model: db.Grado, 
              as: "grado", 
              attributes: ["nombre_grado"] 
            }
          ]
        }
      ]
    });

    res.json(asistencias);
  } catch (error) {
    res.status(500).json({ 
      error: "❌ Error al obtener historial del profesor", 
      detalle: error.message 
    });
  }
},


/** 8. Historial por estudiante **/
async historialPorEstudiante(req, res) {
  try {
    const { id } = req.params;
    const asistencias = await Asistencia.findAll({
      where: { id_estudiante: id },
      include: [
        { 
          model: Funcionario, 
          as: "funcionario",
          include: [{ model: Persona, as: "persona", attributes: ["nombre", "apellido"] }]
        },
        { model: EstadoAsistencia, as: "estadoAsistencia", attributes: ["nombre"] },
        { model: GradoAsistencia, as: "gradoAsistencia",
          include:[
            { model:db.Grado, as: "grado", attributes: ["nombre_grado"] }
          ]
         }
      ]
    });
    res.json(asistencias);
  } catch (error) {
    res.status(500).json({ error: "❌ Error al obtener historial del estudiante", detalle: error.message });
  }
}

};

module.exports = asistenciaController;
