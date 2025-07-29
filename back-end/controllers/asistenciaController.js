const db = require('../models');
const { Asistencia, Estudiante, Persona, GradoAsistencia, EstadoAsistencia,Grado } = require('../models');
const { Op } = require('sequelize');

const asistenciaController = {
  /** 1. Registrar una nueva asistencia individual **/
  async registrar(req, res) {
    try {
      const {
        id_estudiante,
        id_funcionario,
        id_grado_asistencia,
        id_estado_asistencia,
        observacion,
        fecha
      } = req.body;

      if (!id_estado_asistencia || !id_grado_asistencia) {
        return res.status(400).json({ error: 'Faltan datos obligatorios' });
      }

      const nueva = await Asistencia.create({
        id_estudiante,
        id_funcionario,
        id_grado_asistencia,
        id_estado_asistencia,
        observacion: observacion || '',
        fecha
      });

      return res.status(201).json({ mensaje: 'Asistencia registrada', asistencia: nueva });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error: 'Error al registrar asistencia', detalle: error.message });
    }
  },

/** 2. Obtener todas las asistencias con relaciones **/
obtenerTodas: async (req, res) => {
  try {
    const { estudiante, estado, grado, fecha } = req.query;

    // Filtros dinámicos
    const whereAsistencia = {};
    const wherePersona = {};
    const whereEstado = {};
    const whereGrado = {};

    if (fecha) {
      whereAsistencia.fecha = fecha;
    }

    if (estado) {
      // Filtramos por nombre del estado
      whereEstado.nombre = { [Op.like]: `%${estado}%` };
    }

    if (grado) {
      whereGrado.nombre_grado = { [Op.like]: `%${grado}%` };
    }

    if (estudiante) {
      // Filtrar por nombre o apellido de persona
      wherePersona[Op.or] = [
        { nombre: { [Op.like]: `%${estudiante}%` } },
        { apellido: { [Op.like]: `%${estudiante}%` } },
      ];
    }

    const asistencias = await Asistencia.findAll({
      where: whereAsistencia,
      include: [
        {
          model: Estudiante,
          as: 'estudiante',
          include: [
            {
              model: Persona,
              as: 'persona',
              where: Object.keys(wherePersona).length ? wherePersona : undefined,
            },
          ],
        },
        {
          model: GradoAsistencia,
          as: 'gradoAsistencia',
          include: [
            {
              model: Grado,
              as: 'grado',
              where: Object.keys(whereGrado).length ? whereGrado : undefined,
            },
          ],
        },
        {
          model: EstadoAsistencia,
          as: 'estadoAsistencia',
          where: Object.keys(whereEstado).length ? whereEstado : undefined,
        },
      ],
    });

    res.json(asistencias);
  } catch (error) {
    console.error("❌ Error en obtenerTodas:", error);
    res.status(500).json({ error: "Error al obtener asistencias" });
  }
}
,
  /** 3. Obtener asistencia por ID **/
  async obtenerPorId(req, res) {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

    try {
      const asistencia = await Asistencia.findByPk(id);
      if (!asistencia) return res.status(404).json({ mensaje: 'Asistencia no encontrada' });
      return res.json(asistencia);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error al buscar asistencia' });
    }
  },

  /** 4. Buscar asistencias por estudiante **/
  async porEstudiante(req, res) {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: 'ID de estudiante inválido' });

    try {
      const asistencias = await Asistencia.findAll({ where: { id_estudiante: id } });
      return res.json(asistencias);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error al buscar asistencias del estudiante' });
    }
  },

  /** 5. Buscar asistencias por profesor **/
  async porProfesor(req, res) {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: 'ID de profesor inválido' });

    try {
      const asistencias = await Asistencia.findAll({ where: { id_funcionario: id } });
      return res.json(asistencias);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error al buscar asistencias del profesor' });
    }
  },

  /** 6. Buscar asistencias por fecha **/
  async porFecha(req, res) {
    const { fecha } = req.params;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
      return res.status(400).json({ error: 'Formato de fecha inválido. Usa YYYY-MM-DD' });
    }

    try {
      const asistencias = await Asistencia.findAll({ where: { fecha } });
      return res.json(asistencias);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error al buscar asistencias por fecha' });
    }
  },

  /** 7. Filtrar asistencias por estado y/o fecha **/
  async filtrar(req, res) {
    const { id_estado_asistencia, fecha } = req.query;
    const where = {};

    if (id_estado_asistencia) where.id_estado_asistencia = id_estado_asistencia;
    if (fecha) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
        return res.status(400).json({ error: 'Formato de fecha inválido. Usa YYYY-MM-DD' });
      }
      where.fecha = fecha;
    }

    try {
      const asistencias = await Asistencia.findAll({ where });
      return res.json(asistencias);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error al filtrar asistencias' });
    }
  },

  /** 8. Contar asistencias por estado **/
  async contarPorEstado(req, res) {
    const id_estado_asistencia = req.params.estado;

    try {
      const total = await Asistencia.count({ where: { id_estado_asistencia } });
      return res.json({ id_estado_asistencia, total });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error al contar asistencias por estado' });
    }
  },

  /** 9. Registrar asistencias masivas **/
async registrarMasivo(req, res) {
  const registros = req.body;
  if (!Array.isArray(registros)) {
    return res.status(400).json({ error: 'Se esperaba un arreglo de asistencias.' });
  }

  try {
    // 1. Crear el registro en grado_asistencia para agrupar las asistencias
    const { id_grado_asistencia, id_funcionario } = registros[0];

    const fechaHoy = new Date().toISOString().split('T')[0];
    const gradoAsistencia = await GradoAsistencia.create({
      id_grado: id_grado_asistencia,
      id_funcionario: id_funcionario || 1,
      fecha: fechaHoy
    });

    // 2. Reemplazar el id_grado_asistencia por el ID real creado
    const registrosConGrado = registros.map(r => ({
      ...r,
      id_grado_asistencia: gradoAsistencia.id_grado_asistencia
    }));

    const creadas = await Asistencia.bulkCreate(registrosConGrado);

    return res.status(201).json({
      mensaje: `Se registraron ${creadas.length} asistencias`,
      id_grado_asistencia: gradoAsistencia.id_grado_asistencia
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error interno al registrar asistencias masivo' });
  }
},

/** 10. Registrar asistencia por grado **/
async registrarPorGrado(req, res) {
  const id_grado = parseInt(req.params.id_grado, 10);
  if (isNaN(id_grado)) {
    return res.status(400).json({ error: 'ID de grado inválido' });
  }

  try {
    const asignaciones = await EstudianteGrado.findAll({ where: { id_grado } });
    if (asignaciones.length === 0) {
      return res.status(404).json({ mensaje: 'No hay estudiantes en ese grado' });
    }

    const fechaHoy = new Date().toISOString().split('T')[0];
    const { id_funcionario, id_estado_asistencia, observacion } = req.body;

    if (!id_estado_asistencia) {
      return res.status(400).json({ error: 'Falta id_estado_asistencia en el payload' });
    }

    // 1. Crear el evento en grado_asistencia
    const gradoAsistencia = await GradoAsistencia.create({
      id_grado,
      id_funcionario: id_funcionario || 1,
      fecha: fechaHoy
    });

    // 2. Crear las asistencias individuales
    const registros = asignaciones.map(a => ({
      id_estudiante: a.id_estudiante,
      id_funcionario: id_funcionario || 1,
      id_grado_asistencia: gradoAsistencia.id_grado_asistencia,
      id_estado_asistencia,
      observacion: observacion || '',
      fecha: fechaHoy
    }));

    const creadas = await Asistencia.bulkCreate(registros);

    return res.status(201).json({
      mensaje: `Asistencia tomada para ${creadas.length} estudiantes`,
      id_grado_asistencia: gradoAsistencia.id_grado_asistencia
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error interno al tomar asistencia por grado' });
  }
}
,
  /** 11. Actualizar una asistencia por ID **/
  async actualizar(req, res) {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

    try {
      const [updated] = await Asistencia.update(req.body, { where: { id_asistencia: id } });
      if (updated === 0) {
        return res.status(404).json({ mensaje: 'Asistencia no encontrada o sin cambios' });
      }

      const asistencia = await Asistencia.findByPk(id);
      return res.json({ mensaje: 'Asistencia actualizada', asistencia });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error al actualizar asistencia' });
    }
  },

  /** 12. Eliminar una asistencia por ID **/
  async eliminar(req, res) {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

    try {
      const borrado = await Asistencia.destroy({ where: { id_asistencia: id } });
      if (borrado === 0) {
        return res.status(404).json({ mensaje: 'Asistencia no encontrada' });
      }
      return res.json({ mensaje: 'Asistencia eliminada' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error al eliminar asistencia' });
    }
  }
};

module.exports = asistenciaController;
