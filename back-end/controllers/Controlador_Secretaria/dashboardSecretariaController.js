// controllers/dashboardSecretariaController.js
const db = require('../../models');
const { Op, fn, col, literal } = require('sequelize');

const Usuario = db.Usuario;
const Observacion = db.Observacion;
const Estudiante = db.Estudiante;
const Funcionario = db.Funcionario;
const EstadoUsuario = db.EstadoUsuario;

const dashboardSecretariaController = {
  // 📌 Resumen para TarjetasResumen
  async obtenerResumen(req, res) {
    try {
      const totalEstudiantes = await Usuario.count({ where: { id_tipo_usuario: 1 } }); // Estudiantes
      const totalDocentes = await Usuario.count({ where: { id_tipo_usuario: 3 } });   // Docentes
      const totalReportes = await Observacion.count();

      res.json({
        estudiantes: totalEstudiantes,
        docentes: totalDocentes,
        reportes: totalReportes
      });
    } catch (error) {
      console.error("Error en obtenerResumen:", error);
      res.status(500).json({ error: 'Error al obtener el resumen' });
    }
  },

  // 📊 Datos para Gráfico de Barras
  async obtenerMensual(req, res) {
    try {
      const mesesBase = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
      ];

      const estudiantesPorMes = await Usuario.findAll({
        attributes: [
          [fn('MONTH', col('fecha_creacion')), 'mes'],
          [fn('COUNT', col('*')), 'inscritos']
        ],
        where: { id_tipo_usuario: { [Op.eq]: 1 } },
        group: [literal('MONTH(fecha_creacion)')],
        order: [literal('MONTH(fecha_creacion)')]
      });

      const reportesPorMes = await Observacion.findAll({
        attributes: [
          [fn('MONTH', col('fecha')), 'mes'],
          [fn('COUNT', col('*')), 'reportes']
        ],
        group: [literal('MONTH(fecha)')],
        order: [literal('MONTH(fecha)')]
      });

      const data = mesesBase.map((mes, index) => {
        const e = estudiantesPorMes.find(x => parseInt(x.dataValues.mes) === index + 1);
        const r = reportesPorMes.find(x => parseInt(x.dataValues.mes) === index + 1);
        return {
          mes,
          inscritos: e ? parseInt(e.dataValues.inscritos) : 0,
          reportes: r ? parseInt(r.dataValues.reportes) : 0
        };
      });

      res.json(data);
    } catch (error) {
      console.error("Error en obtenerMensual:", error);
      res.status(500).json({ error: 'Error al obtener datos mensuales' });
    }
  },

  // 🥧 Gráfico Circular - Estado de Formularios
  async obtenerEstadoFormularios(req, res) {
    try {
      const resultados = await Usuario.findAll({
        attributes: [
          [fn('COUNT', col('Usuario.id_usuario')), 'cantidad']
        ],
        include: [{
          model: EstadoUsuario,
          as: 'estado',
          attributes: ['nombre']
        }],
        where: {
          id_tipo_usuario: 1
        },
        group: ['estado.nombre']
      });

      const data = resultados.map(r => ({
        name: r.estado.nombre,
        value: parseInt(r.get('cantidad'))
      }));

      res.json(data);
    } catch (error) {
      console.error("Error en obtenerEstadoFormularios:", error);
      res.status(500).json({ error: 'Error al obtener estado de formularios' });
    }
  },

  // 📋 Movimientos Recientes (usuarios creados + observaciones)
  // 📋 Tabla de Observaciones Recientes
async obtenerRecientes(req, res) {
  try {
    const observaciones = await db.Observacion.findAll({
      attributes: ['id_observacion', 'fecha', 'descripcion'],
      include: [
        {
          model: db.Estudiante,
          as: 'estudiante',
          attributes: ['numero_documento']
        },
        {
          model: db.Funcionario,
          as: 'funcionario',
          attributes: ['id_funcionario']
        }
      ],
      order: [['fecha', 'DESC']],
      limit: 5
    });

    res.json(observaciones);
  } catch (error) {
    console.error('Error al obtener observaciones recientes:', error);
    res.status(500).json({ error: 'Error al obtener observaciones recientes' });
  }
}

};

module.exports = dashboardSecretariaController;
