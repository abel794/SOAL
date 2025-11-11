const db = require('../../models');
  // arriba del archivo, reemplaza la destructuración por esta (añade Funcionario)
const { Asistencia, Estudiante, Persona, GradoAsistencia, EstadoAsistencia, Grado, Funcionario } = require('../../models');
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



// ... luego dentro de asistenciaController:

async filtrar(req, res) {
  try {
    console.log('📩 Parámetros recibidos:', req.query || {});

    const {
      id_asistencia,
      id_estudiante,
      id_funcionario,
      id_grado_asistencia,
      fecha,
      id_estado_asistencia,
      observacion,
      nombre_estudiante,
      nombre_funcionario,
      nombre_grado,
      estado
    } = req.query;

    // WHERE principal para Asistencia
    const whereAsistencia = {};
    if (id_asistencia) whereAsistencia.id_asistencia = Number(id_asistencia);
    if (id_estudiante) whereAsistencia.id_estudiante = Number(id_estudiante);
    if (id_funcionario) whereAsistencia.id_funcionario = Number(id_funcionario);
    if (id_grado_asistencia) whereAsistencia.id_grado_asistencia = Number(id_grado_asistencia);
    if (id_estado_asistencia) whereAsistencia.id_estado_asistencia = Number(id_estado_asistencia);

    if (fecha) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
        console.log('❌ Fecha inválida recibida:', fecha);
        return res.status(400).json({
          mensaje: "❌ Formato de fecha inválido.",
          sugerencia: "Usa YYYY-MM-DD (ej: 2025-11-01)."
        });
      }
      whereAsistencia.fecha = fecha;
    }

    if (observacion) {
      whereAsistencia.observacion = { [Op.like]: `%${observacion}%` };
    }

    // Si no hay ningún filtro, devolvemos TODO (según tu petición).
    // IMPORTANT: si la tabla es grande, considerar paginación.
    const anyFilterProvided = Object.keys(whereAsistencia).length > 0
      || nombre_estudiante || nombre_funcionario || nombre_grado || estado;

    // Construimos los includes con alias idénticos a tus modelos
    const include = [];

    // Estudiante -> Persona
    const estudianteInclude = {
      model: Estudiante,
      as: 'estudiante',
      required: false,
      include: [
        {
          model: Persona,
          as: 'persona',
          required: false,
          attributes: ['numero_documento', 'nombre', 'apellido']
        }
      ]
    };
    if (nombre_estudiante) {
      estudianteInclude.include[0].where = {
        [Op.or]: [
          { nombre: { [Op.like]: `%${nombre_estudiante}%` } },
          { apellido: { [Op.like]: `%${nombre_estudiante}%` } }
        ]
      };
      estudianteInclude.include[0].required = true; // si filtras por persona, obliga el match
      console.log(`🔍 Filtrando por nombre_estudiante: "${nombre_estudiante}"`);
    }
    include.push(estudianteInclude);

    // Funcionario -> Persona
    const funcionarioInclude = {
      model: Funcionario,
      as: 'funcionario',
      required: false,
      include: [
        {
          model: Persona,
          as: 'persona',
          required: false,
          attributes: ['numero_documento', 'nombre', 'apellido'],required: false
        }
      ]
    };
    if (nombre_funcionario) {
      funcionarioInclude.include[0].where = {
        [Op.or]: [
          { nombre: { [Op.like]: `%${nombre_funcionario}%` } },
          { apellido: { [Op.like]: `%${nombre_funcionario}%` } }
        ]
      };
      funcionarioInclude.include[0].required = true;
      console.log(`🔍 Filtrando por nombre_funcionario: "${nombre_funcionario}"`);
    }
    include.push(funcionarioInclude);

    // GradoAsistencia -> Grado
    const gradoAsigInclude = {
      model: GradoAsistencia,
      as: 'gradoAsistencia',
      required: false,
      include: [
        {
          model: Grado,
          as: 'grado',
          required: false,
          attributes: ['id_grado', 'nombre_grado']
        }
      ]
    };
    if (nombre_grado) {
      gradoAsigInclude.include[0].where = { nombre_grado: { [Op.like]: `%${nombre_grado}%` } };
      gradoAsigInclude.include[0].required = true;
      console.log(`🔍 Filtrando por nombre_grado: "${nombre_grado}"`);
    }
    include.push(gradoAsigInclude);

    // EstadoAsistencia
    const estadoInclude = {
      model: EstadoAsistencia,
      as: 'estadoAsistencia',
      required: false,
      attributes: ['id_estado_asistencia', 'nombre']
    };
    if (estado) {
      estadoInclude.where = { nombre: { [Op.like]: `%${estado}%` } };
      estadoInclude.required = true;
      console.log(`🔍 Filtrando por estado: "${estado}"`);
    }
    include.push(estadoInclude);

    console.log('🔧 whereAsistencia:', whereAsistencia);
    console.log('📦 include summary:', include.map(i => ({ as: i.as, required: !!i.required, nested: (i.include||[]).map(n=>({as:n.as, required:!!n.required})) })));

    // Si no se proporcionaron filtros, devolvemos TODO (si prefieres 400 aquí, cambia).
    const queryOptions = {
      where: anyFilterProvided ? whereAsistencia : undefined,
      include
    };

    console.log('⏳ Ejecutando Asistencia.findAll con options:', Object.keys(queryOptions).filter(k=>queryOptions[k]!==undefined));

    const asistencias = await Asistencia.findAll(queryOptions);

    console.log('✅ Consulta ejecutada. Registros:', Array.isArray(asistencias) ? asistencias.length : 0);

    if (!asistencias || asistencias.length === 0) {
      return res.status(200).json({
        mensaje: "⚠️ No se encontraron asistencias con los filtros aplicados.",
        sugerencia: "Prueba con menos filtros o sin filtros.",
        datos: []
      });
    }

    // Mapear resultados a formato simple para el frontend
    const datos = asistencias.map(a => ({
      id_asistencia: a.id_asistencia,
      id_estudiante: a.id_estudiante,
      id_funcionario: a.id_funcionario,
      id_grado_asistencia: a.id_grado_asistencia,
      fecha: a.fecha,
      id_estado_asistencia: a.id_estado_asistencia,
      observacion: a.observacion || '',
      estudiante_nombre: a.estudiante?.persona ? `${a.estudiante.persona.nombre} ${a.estudiante.persona.apellido}` : (a.estudiante_nombre || null),
      funcionario_nombre: a.funcionario?.persona ? `${a.funcionario.persona.nombre} ${a.funcionario.persona.apellido}` : (a.funcionario_nombre || null),
      grado_nombre: a.gradoAsistencia?.grado?.nombre_grado || (a.grado_nombre || null),
      estado_nombre: a.estadoAsistencia?.nombre || (a.estado_nombre || null)
    }));

    console.log('📨 Enviando respuesta con', datos.length, 'registros. Ejemplo:', datos[0]);

    return res.status(200).json({
      mensaje: `✅ ${datos.length} resultado(s) encontrados.`,
      total: datos.length,
      datos
    });

  } catch (error) {
    console.error("💥 Error en filtrar asistencias:", error);
    if (error.parent && error.parent.sqlMessage) {
      console.error('SQL Message:', error.parent.sqlMessage);
      console.error('SQL:', error.parent.sql);
    }
    return res.status(500).json({
      mensaje: "💥 Error interno del servidor.",
      detalle: error.message || 'Revisa logs en servidor.'
    });
  }
}
,

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

  // 1️⃣ Validación básica
  if (!Array.isArray(registros) || registros.length === 0) {
    return res.status(400).json({ error: 'Se esperaba un arreglo con asistencias.' });
  }

  try {
    // 2️⃣ Obtener id_funcionario desde el token (middleware)
    const idFuncionarioLogueado = req.usuario?.id_funcionario;
    if (!idFuncionarioLogueado) {
      return res.status(401).json({ error: 'No se pudo determinar el funcionario logueado.' });
    }

    // 3️⃣ Tomar id_grado del primer registro
    const { id_grado_asistencia } = registros[0];
    if (!id_grado_asistencia) {
      return res.status(400).json({ error: 'Falta id_grado_asistencia en los registros.' });
    }

    // 4️⃣ Crear el registro en GradoAsistencia
    const fechaHoy = new Date().toISOString().split('T')[0];
    const gradoAsistencia = await GradoAsistencia.create({
      id_grado: id_grado_asistencia, // id del grado real
      id_funcionario: idFuncionarioLogueado, // ✅ funcionario logueado
      fecha: fechaHoy
    });

    // 5️⃣ Preparar registros individuales con el ID real de grado_asistencia
    const registrosConGrado = registros.map(r => ({
      ...r,
      id_grado_asistencia: gradoAsistencia.id_grado_asistencia,
      id_funcionario: idFuncionarioLogueado // opcional si tu tabla lo requiere
    }));

    // 6️⃣ Validar campos de cada asistencia
    for (const reg of registrosConGrado) {
      if (!reg.id_estudiante || !reg.id_estado_asistencia || !reg.id_grado_asistencia) {
        return res.status(400).json({
          error: 'Faltan campos obligatorios en alguna asistencia.',
          detalle: reg
        });
      }
    }

    // 7️⃣ Crear todas las asistencias en lote
    const creadas = await Asistencia.bulkCreate(registrosConGrado);

    // 8️⃣ Respuesta final
    return res.status(201).json({
      mensaje: `✅ Se registraron ${creadas.length} asistencias correctamente.`,
      id_grado_asistencia: gradoAsistencia.id_grado_asistencia,
      fecha: fechaHoy
    });

  } catch (error) {
    console.error("❌ Error en registrarMasivo:", error);
    return res.status(500).json({
      error: 'Error interno al registrar asistencias masivo',
      detalle: error.message
    });
  }
}
,

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
