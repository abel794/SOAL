// controllers/estudianteController.js
const { Op, Sequelize } = require("sequelize");
const { 
  Estudiante,
  Persona,
  Usuario,
  Eps,
  EstadoAcademico,
  Acudiente,
  RelacionAcudiente,
  Observacion,
  Asistencia,
  EstudianteGrado,
  Grado
} = require('../../models');


module.exports = {
  // 1. Listar todos
  async listarTodos(req, res) {
    try {
      console.log('[listarTodos] Consultando todos los estudiantes...');
      const estudiantes = await Estudiante.findAll({
        include: [
          { model: Persona, as: 'persona' },
          { model: Usuario, as: 'usuario' },
          { model: Eps, as: 'eps' },
          { model: EstadoAcademico, as: 'estadoAcademico' },
          {
            model: Acudiente,
            as: 'acudientes',
            through: { attributes: [] },
            include: [
              { model: Persona, as: 'persona' },
              { model: RelacionAcudiente, as: 'relacion' }
            ]
          }
        ]
      });
      console.log(`[listarTodos] Encontrados ${estudiantes.length} estudiantes`);
      res.json(estudiantes);
    } catch (error) {
      console.error('[listarTodos] Error al listar estudiantes:', error);
      res.status(500).json({ error: 'Error al obtener estudiantes' });
    }
  },

  // 2. Buscar con filtro (CORREGIDO)
  async buscar(req, res) {
  try {
    const { filtro } = req.query;
    console.log(`[buscar] Filtro recibido: "${filtro || 'sin filtro'}"`);

    // ==== Opciones base para el findAll ====
    const opcionesConsulta = {
      where: {},
      attributes: ['id_estudiante', 'numero_documento', 'id_usuario', 'id_eps', 'id_estado_academico'],
      include: [
        // Persona del estudiante (y filtro aplicado aquí si existe)
        {
          model: Persona,
          as: 'persona',
          attributes: ['nombre', 'apellido', 'numero_documento', 'telefono', 'fecha_nacimiento', 'direccion', 'correo'],
          ...(filtro && filtro.trim() !== ''
            ? {
                where: {
                  [Op.or]: [
                    { nombre: { [Op.like]: `%${filtro}%` } },
                    { apellido: { [Op.like]: `%${filtro}%` } },
                    { numero_documento: { [Op.like]: `%${filtro}%` } }
                  ]
                },
                required: true
              }
            : {})
        },

        // Usuario asociado
        {
          model: Usuario,
          as: 'usuario',
          attributes: ['id_usuario', 'username', 'id_tipo_usuario']
        },

        // EPS
        {
          model: Eps,
          as: 'eps',
          attributes: ['id_eps', 'nombre']
        },

        // Estado académico
        {
          model: EstadoAcademico,
          as: 'estadoAcademico',
          attributes: ['id_estado_academico', 'nombre']
        },

        // Grado actual (activo = 1)
        {
          model: EstudianteGrado,
          as: 'grados',
          required: false,
          where: { activo: 1 },
          attributes: ['id_estudiante_grado', 'id_grado', 'anio_academico', 'activo', 'fecha_finalizacion', 'id_estado'],
          include: [
            {
              model: Grado,
              as: 'grado',
              attributes: ['id_grado', 'nombre_grado', 'descripcion']
            }
          ]
        },

        // Observaciones (todas)
        {
          model: Observacion,
          as: 'observaciones',
          required: false,
          attributes: ['id_observacion', 'fecha', 'descripcion', 'id_gravedad', 'id_categoria'],
          order: [['fecha', 'DESC']]
        },

        // Asistencias (todas)
        {
          model: Asistencia,
          as: 'asistencias',
          required: false,
          attributes: ['id_asistencia', 'fecha', 'observacion', 'id_estado_asistencia', 'id_grado_asistencia']
        },

        // Acudientes (padres) y dentro de cada acudiente traemos sus datos personales, relación y TODOS sus estudiantes (hermanos)
        {
          model: Acudiente,
          as: 'acudientes',
          through: { attributes: ['id_estudiante_acudiente'] }, // pivote
          attributes: ['id_acudiente', 'numero_documento', 'id_relacion'],
          required: false,
          include: [
            {
              model: Persona,
              as: 'persona',
              attributes: ['nombre', 'apellido', 'telefono', 'correo', 'direccion']
            },
            {
              model: RelacionAcudiente,
              as: 'relacion',
              attributes: ['id_relacion', 'nombre']
            },
            // Aquí traemos los demás estudiantes asociados a este acudiente (hermanos)
            {
              model: Estudiante,         // necesita que en models.Acudiente hayas definido: Acudiente.belongsToMany(Estudiante, { through: EstudianteAcudiente, as: 'estudiantes', ...})
              as: 'estudiantes',
              through: { attributes: [] },
              attributes: ['id_estudiante', 'numero_documento', 'id_usuario', 'id_eps'],
              required: false,
              include: [
                {
                  model: Persona,
                  as: 'persona',
                  attributes: ['nombre', 'apellido', 'numero_documento']
                },
                {
                  model: EstudianteGrado,
                  as: 'grados',
                  where: { activo: 1 },
                  required: false,
                  include: [{ model: Grado, as: 'grado', attributes: ['id_grado', 'nombre_grado'] }]
                },
                {
                  model: EstadoAcademico,
                  as: 'estadoAcademico',
                  attributes: ['id_estado_academico', 'nombre'],
                  required: false
                }
              ]
            }
          ]
        }
      ],
      order: [
        [{ model: EstudianteGrado, as: 'grados' }, 'anio_academico', 'DESC'],
        [{ model: Observacion, as: 'observaciones' }, 'fecha', 'DESC']
      ],
      distinct: true // importante cuando hay many-to-many para que count/limit funcionen bien
    };

    // ==== Ejecutar la consulta ====
    const estudiantesRaw = await Estudiante.findAll(opcionesConsulta);
    console.log(`[buscar] Estudiantes raw encontrados: ${estudiantesRaw.length}`);

    // ==== Post-procesamiento: resumenes útiles por estudiante ====
    const estudiantesProcesados = await Promise.all(estudiantesRaw.map(async (est) => {
      const estJson = est.toJSON();

      // resumen de asistencias por estado (conteo)
      const asistenciasConteo = await Asistencia.findAll({
        attributes: ['id_estado_asistencia', [Sequelize.fn('COUNT', Sequelize.col('id_asistencia')), 'total']],
        where: { id_estudiante: estJson.id_estudiante },
        group: ['id_estado_asistencia']
      });

      // convertir a objeto { estadoId: total, ... }
      const resumenAsistencias = {};
      asistenciasConteo.forEach(row => {
        resumenAsistencias[row.id_estado_asistencia] = Number(row.get('total'));
      });

      // última observación (si existe)
      const ultimaObs = estJson.observaciones && estJson.observaciones.length
        ? estJson.observaciones.reduce((prev, curr) => (new Date(prev.fecha) > new Date(curr.fecha) ? prev : curr))
        : null;

      // calcular cantidad total de observaciones
      const totalObservaciones = Array.isArray(estJson.observaciones) ? estJson.observaciones.length : 0;

      // dar estructura limpia a acudientes y hermanos (por si deseas filtrar o excluir el propio estudiante)
      const acudientesLimpios = (estJson.acudientes || []).map(ac => {
        const hermanos = (ac.estudiantes || [])
          .map(h => {
            // evitar ciclos profundos: traer solo datos esenciales de hermanos
            return {
              id_estudiante: h.id_estudiante,
              numero_documento: h.numero_documento,
              persona: h.persona || null,
              estadoAcademico: h.estadoAcademico || null,
              gradoActual: (h.grados && h.grados[0]) ? {
                id_estudiante_grado: h.grados[0].id_estudiante_grado,
                id_grado: h.grados[0].id_grado,
                anio_academico: h.grados[0].anio_academico,
                grado: h.grados[0].grado || null
              } : null
            };
          });

        return {
          id_acudiente: ac.id_acudiente,
          numero_documento: ac.numero_documento,
          persona: ac.persona || null,
          relacion: ac.relacion || null,
          hermanos // incluye al propio estudiante también; si quieres excluirlo, se filtra abajo
        };
      });

      // armar objeto final por estudiante
      return {
        id_estudiante: estJson.id_estudiante,
        numero_documento: estJson.numero_documento,
        persona: estJson.persona || null,
        usuario: estJson.usuario || null,
        eps: estJson.eps || null,
        estadoAcademico: estJson.estadoAcademico || null,
        gradoActual: (estJson.grados && estJson.grados[0]) ? {
          id_estudiante_grado: estJson.grados[0].id_estudiante_grado,
          id_grado: estJson.grados[0].id_grado,
          anio_academico: estJson.grados[0].anio_academico,
          grado: estJson.grados[0].grado || null
        } : null,
        observaciones: estJson.observaciones || [],
        totalObservaciones,
        ultimaObservacion: ultimaObs,
        asistencias: estJson.asistencias || [],
        resumenAsistencias,
        acudientes: acudientesLimpios
      };
    }));

    console.log(`[buscar] Estudiantes procesados: ${estudiantesProcesados.length}`);
    return res.json(estudiantesProcesados);

  } catch (error) {
    console.error("[buscar] Error al buscar estudiante:", error);
    return res.status(500).json({ error: "Error al buscar estudiante", detail: error.message });
  }
}
,

  // 3. Contar
  async contar(req, res) {
    try {
      const { id_estado_academico } = req.query;
      console.log('[contar] Filtro id_estado_academico =', id_estado_academico);
      const where = {};
      if (id_estado_academico) where.id_estado_academico = id_estado_academico;
      const total = await Estudiante.count({ where });
      console.log('[contar] Total de estudiantes:', total);
      res.json({ total });
    } catch (error) {
      console.error('[contar] Error al contar estudiantes:', error);
      res.status(500).json({ error: 'Error al contar estudiantes' });
    }
  },

  // 4. Crear
  async crear(req, res) {
    try {
      console.log('[crear] Datos:', req.body);
      const { numero_documento, id_usuario, id_eps, id_estado_academico, acudientes } = req.body;
      const nuevo = await Estudiante.create({ numero_documento, id_usuario, id_eps, id_estado_academico });
      if (Array.isArray(acudientes) && acudientes.length) {
        console.log('[crear] Asociando acudientes:', acudientes);
        await nuevo.setAcudientes(acudientes);
      }
      console.log('[crear] Estudiante creado con ID:', nuevo.id_estudiante);
      res.status(201).json(nuevo);
    } catch (error) {
      console.error('[crear] Error al crear estudiante:', error);
      res.status(500).json({ error: 'Error al crear estudiante' });
    }
  },

  // 5. Actualizar
  async actualizar(req, res) {
    try {
      const { id } = req.params;
      console.log('[actualizar] Estudiante ID:', id, 'Datos:', req.body);
      const { acudientes, ...datos } = req.body;
      const est = await Estudiante.findByPk(id);
      if (!est) {
        console.warn('[actualizar] Estudiante no encontrado:', id);
        return res.status(404).json({ error: 'Estudiante no encontrado' });
      }
      await est.update(datos);
      if (Array.isArray(acudientes)) {
        console.log('[actualizar] Actualizando acudientes:', acudientes);
        await est.setAcudientes(acudientes);
      }
      console.log('[actualizar] Actualización exitosa para ID:', id);
      res.json(est);
    } catch (error) {
      console.error('[actualizar] Error al actualizar estudiante:', error);
      res.status(500).json({ error: 'Error al actualizar estudiante' });
    }
  },

  // 6. Eliminar
  async eliminar(req, res) {
    try {
      const { id } = req.params;
      console.log('[eliminar] Estudiante ID:', id);
      const est = await Estudiante.findByPk(id);
      if (!est) {
        console.warn('[eliminar] Estudiante no encontrado:', id);
        return res.status(404).json({ error: 'Estudiante no encontrado' });
      }
      await est.setAcudientes([]);  // limpia pivotes
      await est.destroy();
      console.log('[eliminar] Estudiante eliminado:', id);
      res.json({ mensaje: 'Estudiante eliminado correctamente' });
    } catch (error) {
      console.error('[eliminar] Error al eliminar estudiante:', error);
      res.status(500).json({ error: 'Error al eliminar estudiante' });
    }
  },

  // 7. Obtener por ID
  async obtenerPorId(req, res) {
    try {
      const { id } = req.params;
      console.log('[obtenerPorId] Estudiante ID:', id);
      const est = await Estudiante.findByPk(id, {
        include: [
          { model: Persona,           as: 'persona' },
          { model: Usuario,           as: 'usuario' },
          { model: Eps,               as: 'eps' },
          { model: EstadoAcademico,   as: 'estadoAcademico' },
          {
            model: Acudiente,
            as: 'acudientes',
            through: { attributes: [] },
            include: [
              { model: Persona,           as: 'persona' },
              { model: RelacionAcudiente, as: 'relacion' }
            ]
          }
        ]
      });
      if (!est) {
        console.warn('[obtenerPorId] Estudiante no encontrado:', id);
        return res.status(404).json({ error: 'Estudiante no encontrado' });
      }
      console.log('[obtenerPorId] Estudiante hallado:', est.id_estudiante);
      res.json(est);
    } catch (error) {
      console.error('[obtenerPorId] Error al obtener estudiante:', error);
      res.status(500).json({ error: 'Error al obtener estudiante' });
    }
  },

  // 8. Contar por grado
  async contarPorGrado(req, res) {
    try {
      const { nombre } = req.params;
      console.log('[contarPorGrado] Nombre de grado:', nombre);
      const estudiantes = await Estudiante.findAll({
        include: [
          {
            model: Estudiantegrado,
            as: 'grados',
            include: [
              { model: Grado, as: 'grado', where: { nombre_grado: nombre } }
            ]
          }
        ]
      });
      console.log('[contarPorGrado] Total estudiantes en grado:', estudiantes.length);
      res.json({ total: estudiantes.length });
    } catch (error) {
      console.error('[contarPorGrado] Error al contar por grado:', error);
      res.status(500).json({ error: 'Error al contar estudiantes por grado' });
    }
  },
  // 9. Obtener estudiantes asignados al acudiente logueado
async obtenerPorAcudiente(req, res) {
  try {
    const id_usuario = req.usuario.id_usuario;
    console.log('[obtenerPorAcudiente] Inicio. Payload token:', req.usuario);

    // Buscar el acudiente
    const acudiente = await Acudiente.findOne({
      where: { id_usuario },
      attributes: ['id_acudiente']
    });
    if (!acudiente) {
      console.error('[obtenerPorAcudiente] Acudiente no encontrado');
      return res.status(404).json({ error: 'Acudiente no encontrado' });
    }

    console.log('[obtenerPorAcudiente] id_acudiente encontrado =', acudiente.id_acudiente);

    // Buscar los estudiantes asignados
    const asignaciones = await EstudianteAcudiente.findAll({
      where: { id_acudiente: acudiente.id_acudiente },
      include: [
        {
          model: Estudiante,
          as: 'estudiante',
          include: [
            { model: Persona,
              as: 'persona',
              attributes: ['nombre','apellido']
             }
          ]
        }
      ]
    });
    const estudiantes = asignaciones.map(a => a.estudiante);
    console.log('[obtenerPorAcudiente] Estudiantes asignados:', estudiantes.map(e => e.id_estudiante));

    res.json(estudiantes);
  } catch (error) {
    console.error('[obtenerPorAcudiente] Error:', error);
    res.status(500).json({ error: 'Error al obtener estudiantes del acudiente' });
  }
}

};
