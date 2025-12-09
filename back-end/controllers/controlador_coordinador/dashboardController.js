// 📂 controllers/controlador_coordinador/dashboardController.js
const { sequelize } = require('../../models');
const db = require('../../models');
const {
  Notificacion,
  Pqr,
  HistorialPqr,
  Funcionario,
  Persona,
  Usuario,
  FuncionarioGrado,
  Grado,
  Sexo,
  TipoDocumento,
  TipoUsuario,
  EstadoUsuario,
  Observacion,
  CategoriaObservacion,
  GravedadObservacion,
  HistorialObservacion,
  Asistencia,
  EstadoAsistencia,
  Cita,
  Estudiante,
  Acudiente,
  EstudianteGrado
} = db

const axios = require('axios');

const dashboardController = {
  async profesoresActivos(req, res) {
  console.log("💡 Ejecutando profesoresActivos (versión ligera)");
  try {
    const profesores = await Funcionario.findAll({
      include: [
        {
          model: Persona,
          as: "persona",
          attributes: ["numero_documento", "nombre", "apellido", "correo"]
        },
        {
          model: FuncionarioGrado,
          as: "gradosAsignados",
          include: [
            {
              model: Grado,
              as: "grado",
              attributes: ["nombre_grado"]
            }
          ],
          required: false
        },
        {
          model: Usuario,
          as: "usuario",
          where: { id_tipo_usuario: 3, id_estado_usuario: 1 },
          attributes: ["username"],
          required: true
        }
      ],
      attributes: []
    });

    res.json({ total: profesores.length, profesores });
  } catch (error) {
    console.error("❌ Error al obtener profesores activos:", error);
    res.status(500).json({ error: "Error al obtener profesores activos" });
  }
}
,
async profesoresCompletos(req, res) {
  try {
    const profesores = await Funcionario.findAll({
      include: [
        // Datos personales
        {
          model: Persona,
          as: "persona",
          include: [
            { model: Sexo, attributes: ["nombre"] },
            { model: TipoDocumento, attributes: ["nombre"] }
          ]
        },

        // Usuario
        {
          model: Usuario,
          as: "usuario",
          include: [
            { model: EstadoUsuario, attributes: ["nombre"] },
            { model: TipoUsuario, attributes: ["nombre"] }
          ]
        },

        // Grados asignados
        {
          model: FuncionarioGrado,
          as: "gradosAsignados",
          include: [
            { model: Grado, as: "grado", attributes: ["id_grado", "nombre_grado"] }
          ]
        },

        // Observaciones
        {
          model: Observacion,
          as: "observaciones",
          include: [
            { model: CategoriaObservacion, as: "categoria", attributes: ["nombre"] },
            { model: GravedadObservacion, as: "gravedad", attributes: ["nombre"] }
          ]
        },

        // Asistencias
        {
          model: Asistencia,
          as: "asistencias",
          include: [
            {
              model: Estudiante,
              include: [
                { model: Persona, as: "persona", attributes: ["nombre", "apellido"] }
              ]
            }
          ]
        },

        // Citas
        {
          model: Cita,
          as: "citas",
          required: false,
          attributes: ["id_cita", "fecha_cita", "motivo", "estado"],
          include: [
            { model: Estudiante, as: "estudiante" },
            { model: Acudiente, as: "acudiente" }
          ]
        }
      ]
    });

    res.json({ total: profesores.length, profesores });

  } catch (error) {
    console.error("❌ Error en profesoresCompletos:", error);
    res.status(500).json({ error: "Error al obtener todos los profesores" });
  }
}
,

  async observacionesPorGravedad(req, res) {
    console.log('💡 Ejecutando observacionesPorGravedad');
    try {
      const observaciones = await Observacion.findAll({
        attributes: [
          [sequelize.col('estudiante->gradosAsignados->grado.nombre_grado'), 'grado'],
          [sequelize.col('estudiante.persona.nombre'), 'nombre_estudiante'],
          [sequelize.col('estudiante.persona.apellido'), 'apellido_estudiante'],
          [sequelize.col('funcionario.persona.nombre'), 'nombre_funcionario'],
          [sequelize.col('funcionario.persona.apellido'), 'apellido_funcionario'],
          'fecha',
          'id_gravedad',
          [sequelize.literal(
            "CASE " +
              "WHEN `Observacion`.`id_gravedad` = 1 THEN 'Leve' " +
              "WHEN `Observacion`.`id_gravedad` = 2 THEN 'Moderada' " +
              "WHEN `Observacion`.`id_gravedad` = 3 THEN 'Grave' " +
              "WHEN `Observacion`.`id_gravedad` = 4 THEN 'Crítica' " +
              "WHEN `Observacion`.`id_gravedad` = 5 THEN 'Muy Crítica' " +
              "WHEN `Observacion`.`id_gravedad` = 6 THEN 'Extrema' " +
              "ELSE 'Desconocida' END"
          ), 'tipo_gravedad'],
          [sequelize.fn('COUNT', sequelize.col('Observacion.id_observacion')), 'total_observaciones']
        ],
        include: [
          {
            model: Estudiante,
            as: 'estudiante',
            include: [
              {
                model: Persona,
                as: 'persona',
                attributes: []
              },
              {
                model: EstudianteGrado,
                as: 'gradosAsignados',
                include: [
                  {
                    model: Grado,
                    as: 'grado',
                    attributes: []
                  }
                ],
                attributes: []
              }
            ],
            attributes: []
          },
          {
            model: Funcionario,
            as: 'funcionario',
            include: [
              {
                model: Persona,
                as: 'persona',
                attributes: []
              }
            ],
            attributes: []
          }
        ],
        // agrupar por los campos que se seleccionan
        group: [
          'estudiante->gradosAsignados->grado.nombre_grado',
          'estudiante.id_estudiante',
          'funcionario.id_funcionario',
          'Observacion.fecha',
          'Observacion.id_gravedad'
        ],
        order: [[sequelize.literal('total_observaciones'), 'DESC']],
        raw: false // devolver instancias para acceder a dataValues
      });

      if (!observaciones || observaciones.length === 0) {
        return res.status(404).json({ mensaje: 'No hay observaciones registradas.' });
      }

      // Resumen por grado
      const resumenPorGrado = observaciones.reduce((acc, obs) => {
        const grado = obs.dataValues.grado || 'Sin grado';
        acc[grado] = (acc[grado] || 0) + parseInt(obs.dataValues.total_observaciones, 10);
        return acc;
      }, {});

      // Intento de obtener recomendaciones externas
      let recomendaciones = {};
      try {
        const resp = await axios.post('https://api.recomendador-escolar.com/acciones', { resumenPorGrado });
        recomendaciones = resp.data;
      } catch (err) {
        console.warn('⚠️ No se pudieron obtener recomendaciones externas:', err?.message || err);
        recomendaciones = { mensaje: 'No se pudo obtener recomendaciones externas.' };
      }

      res.json({
        total_registros: observaciones.length,
        detalle: observaciones,
        resumenPorGrado,
        recomendaciones
      });
    } catch (error) {
      console.error('❌ Error al obtener observaciones por gravedad:', error);
      res.status(500).json({ error: 'Error al obtener observaciones por gravedad.' });
    }
  },

  async pqrPendientes(req, res) {
    console.log('💡 Ejecutando pqrPendientes');
    try {
      const pqrs = await Pqr.findAll({
        where: { id_estado_pqr: 1 },
        include: [
          {
            model: Estudiante,
            as: 'estudiante',
            include: [
              {
                model: Persona,
                as: 'persona',
                attributes: ['numero_documento','nombre','apellido','correo','telefono']
              }
            ]
          },
          {
            model: Acudiente,
            as: 'acudiente',
            include: [
              {
                model: Persona,
                as: 'persona',
                attributes: ['numero_documento','nombre','apellido','correo','telefono']
              }
            ]
          }
        ]
      });

      res.json({ total: pqrs.length, pqrs });
      console.log('El total de PQR pendientes es:', pqrs.length);
    } catch (error) {
      console.error('Error al contar PQR pendientes:', error);
      res.status(500).json({ error: 'Error al obtener PQR pendientes' });
    }
  },

  async notificacionesEnviadas(req, res) {
    console.log('💡 Ejecutando notificacionesEnviadas');
    try {
      const total = await Notificacion.count();
      res.json({ total });
    } catch (error) {
      console.error('Error al contar notificaciones enviadas:', error);
      res.status(500).json({ error: 'Error al obtener notificaciones' });
    }
  },

  async estudiantesMatriculados(req, res) {
    console.log('💡 Ejecutando estudiantesMatriculados');
    try {
      const estudiantes = await Estudiante.findAll({
        include: [
          {
            model: Usuario,
            as: 'usuario',
            required: true,
            where: { id_tipo_usuario: 1 },
            attributes: ['id_usuario', 'fecha_creacion']
          }
        ],
        attributes: ['id_estudiante']
      });

      const total = estudiantes.length;
      res.json({ total, estudiantes });
    } catch (error) {
      console.error('Error al obtener estudiantes matriculados:', error);
      res.status(500).json({ error: 'Error al obtener estudiantes' });
    }
  },

  async asistenciasRegistradas(req, res) {
    console.log('💡 Ejecutando asistenciasRegistradas');
    try {
      const total = await Asistencia.count();

      const asistencias = await Asistencia.findAll({
        attributes: [
          'id_asistencia',
          'fecha',
          'observacion',
          'id_estudiante',
          'id_funcionario',
          'id_grado_asistencia',
          'id_estado_asistencia'
        ],
        order: [['fecha', 'DESC']]
      });

      res.json({ total, asistencias });
    } catch (error) {
      console.error('Error al obtener asistencias registradas:', error);
      res.status(500).json({ error: 'Error al obtener asistencias' });
    }
  },

  async asistenciasRegistradasfaltas(req, res) {
    console.log('💡 Ejecutando asistenciasRegistradasfaltas');
    try {
      const asistencias = await Asistencia.findAll({
        where: { id_estado_asistencia: 2 },
        include: [
          {
            model: EstadoAsistencia,
            as: 'estadoAsistencia',
            attributes: ['nombre']
          },
          {
            model: Estudiante,
            as: 'estudiante',
            attributes: ['id_estudiante'],
            include: [
              {
                model: Persona,
                as: 'persona',
                attributes: ['nombre']
              }
            ]
          }
        ]
      });

      res.json({ total: asistencias.length, asistencias });
    } catch (error) {
      console.error('Error al obtener asistencias registradas (faltas):', error);
      res.status(500).json({ error: 'Error al obtener asistencias' });
    }
  }
};

module.exports = dashboardController;
