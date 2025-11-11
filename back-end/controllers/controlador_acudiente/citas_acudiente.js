// controllers/controlador_acudiente/citas_acudiente.js
const db = require('../../models');
const {
  Cita,
  Acudiente,
  Estudiante,
  Persona,
  Funcionario,
  Usuario,
  EstadoUsuario,
  EstudianteAcudiente
} = db;

/** Helper para devolver array vacío consistente */
function resEmptyArray(res) {
  return res.json([]);
}

/** Helper: fetch de citas para un id_acudiente dado */
/** Helper: fetch de citas para un id_acudiente dado */
async function fetchCitasPorAcudiente(id_acudiente) {
  if (!id_acudiente) return [];

  const citas = await Cita.findAll({
    where: { id_acudiente },
    include: [
      {
        model: Estudiante,
        as: 'estudiante',
        include: [
          {
            model: Persona,
            as: 'persona',
            attributes: [
              'nombre',
              'apellido',
              'correo',
              'telefono',
              'direccion',
              'ciudad_residencia'
            ]
          },
          {
            model: Acudiente,
            as: 'acudientes',
            include: [
              {
                model: Persona,
                as: 'persona',
                attributes: ['nombre', 'apellido', 'correo', 'telefono']
              }
            ]
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
            attributes: ['nombre', 'apellido', 'correo', 'telefono']
          }
        ]
      },
      {
        model: Funcionario,
        as: 'funcionario',
        include: [
          {
            model: Usuario,
            as: 'usuario',
            attributes: ['username'],
            include: [
              {
                model: EstadoUsuario,
                as: 'estado',
                attributes: ['nombre']
              }
            ]
          }
        ]
      }
    ],
    order: [['fecha_cita', 'DESC']]
  });

  return citas;
}


const citasAcudienteController = {
  /** Wrapper: si hay id_acudiente en params usa obtenerPorId, si no usa token */
  async obtenerPorAcudiente(req, res) {
    try {
      const { id_acudiente } = req.params;
      if (id_acudiente) return await this.obtenerPorId(req, res);
      return await this.obtenerPorToken(req, res);
    } catch (error) {
      console.error('❌ [obtenerPorAcudiente] Error wrapper:', error);
      return res.status(500).json({ mensaje: 'Error interno', detalle: error.message });
    }
  },

  /** Obtener citas según el token del acudiente */
  async obtenerPorToken(req, res) {
    try {
      const idUsuario = req.usuario?.id_usuario;
      if (!idUsuario) return res.status(401).json({ mensaje: 'Token inválido o usuario no autenticado' });

      // 1) Intentar como Acudiente
      const acudiente = await Acudiente.findOne({ where: { id_usuario: idUsuario } });
      if (acudiente) {
        const citas = await fetchCitasPorAcudiente(acudiente.id_acudiente);
        return res.json(citas);
      }

      // 2) Intentar como Estudiante -> buscar acudiente
      const estudiante = await Estudiante.findOne({ where: { id_usuario: idUsuario } });
      if (!estudiante) return resEmptyArray(res);

      const relacion = await EstudianteAcudiente.findOne({ where: { id_estudiante: estudiante.id_estudiante } });
      if (!relacion) return resEmptyArray(res);

      const citas = await fetchCitasPorAcudiente(relacion.id_acudiente);
      return res.json(citas);
    } catch (error) {
      console.error('❌ [obtenerPorToken] Error interno:', error);
      return res.status(500).json({ mensaje: 'Error al obtener citas (token)', detalle: error.message });
    }
  },

  /** Obtener citas por ID de acudiente explícito */
  async obtenerPorId(req, res) {
    try {
      let { id_acudiente } = req.params;
      if (!id_acudiente) return res.status(400).json({ mensaje: 'Falta id_acudiente en la URL' });

      const idNum = Number(id_acudiente);
      if (Number.isNaN(idNum)) return res.status(400).json({ mensaje: 'id_acudiente inválido (no numérico)' });

      // Intentar PK
      let acudiente = await Acudiente.findByPk(idNum);
      if (!acudiente) {
        // Intentar como id_usuario
        const acudienteByUser = await Acudiente.findOne({ where: { id_usuario: idNum } });
        if (!acudienteByUser) return resEmptyArray(res);
        id_acudiente = acudienteByUser.id_acudiente;
      } else {
        id_acudiente = idNum;
      }

      const citas = await fetchCitasPorAcudiente(id_acudiente);
      return res.json(citas);
    } catch (error) {
      console.error('❌ [obtenerPorId] Error interno:', error);
      return res.status(500).json({ mensaje: 'Error al obtener citas por ID', detalle: error.message });
    }
  }
};

module.exports = citasAcudienteController;
