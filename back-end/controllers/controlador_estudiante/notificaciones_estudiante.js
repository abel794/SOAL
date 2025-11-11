//controlador estudiante/notificaciones_estudiante.js
const db = require('../../models');
const { Cita, Estudiante, Acudiente, Persona, Funcionario, Usuario, EstadoUsuario } = db;

const citasEstudianteController = {
  // 🔍 Obtener citas por ID de estudiante (param, id_usuario o token)
  async obtenerPorEstudiante(req, res) {
    try {
      console.log("📥 [obtenerPorEstudiante] Params:", req.params);
      console.log("📥 [obtenerPorEstudiante] Usuario desde token:", req.usuario);

      let { id_estudiante } = req.params;
      const idUsuarioDesdeToken = req.usuario?.id_usuario;

      if (id_estudiante) {
        console.log("🔎 Se recibió id_estudiante por parámetro:", id_estudiante);

        const posibleId = Number(id_estudiante);
        if (!Number.isNaN(posibleId)) {
          console.log("✅ id_estudiante es numérico:", posibleId);

          const existePorPk = await Estudiante.findByPk(posibleId);
          console.log("🔍 Resultado Estudiante.findByPk:", existePorPk?.toJSON());

          if (existePorPk) {
            id_estudiante = posibleId;
            console.log("➡️ Usando id_estudiante directo:", id_estudiante);
          } else {
            console.log("⚠️ No existe estudiante con ese PK, probando con id_usuario...");

            const estudianteByUser = await Estudiante.findOne({ where: { id_usuario: posibleId } });
            console.log("🔍 Resultado Estudiante.findOne({id_usuario}):", estudianteByUser?.toJSON());

            if (estudianteByUser) {
              id_estudiante = estudianteByUser.id_estudiante;
              console.log("➡️ Usando id_estudiante encontrado por id_usuario:", id_estudiante);
            } else {
              console.log("❌ No se encontró estudiante ni por PK ni por id_usuario");
              return res.json([]);
            }
          }
        } else {
          console.log("❌ id_estudiante inválido (no numérico):", id_estudiante);
          return res.status(400).json({ mensaje: 'id_estudiante inválido' });
        }
      } else {
        console.log("ℹ️ No se pasó id_estudiante por params, usando token...");

        if (!idUsuarioDesdeToken) {
          console.log("❌ No viene id_usuario en el token");
          return res.status(400).json({ mensaje: 'No se proporcionó id del estudiante ni id en token' });
        }

        const estudianteRegistro = await Estudiante.findOne({ where: { id_usuario: idUsuarioDesdeToken } });
        console.log("🔍 Resultado Estudiante.findOne por token:", estudianteRegistro?.toJSON());

        if (!estudianteRegistro) {
          console.log("❌ No se encontró estudiante asociado al usuario del token");
          return res.json([]);
        }
        id_estudiante = estudianteRegistro.id_estudiante;
        console.log("➡️ Usando id_estudiante desde token:", id_estudiante);
      }

      // Buscar citas del estudiante
      console.log("🔎 Buscando citas para id_estudiante:", id_estudiante);
      const citas = await Cita.findAll({
        where: { id_estudiante },
        include: [
          {
            model: Estudiante,
            as: 'estudiante',
            include: [{ model: Persona, as: 'persona' }]
          },
          {
            model: Acudiente,
            as: 'acudiente',
            include: [{ model: Persona, as: 'persona' }]
          },
          {
            model: Funcionario,
            as: 'funcionario',
            include: [
              {
                model: Usuario,
                as: 'usuario',
                include: [{ model: EstadoUsuario, as: 'estado' }]
              }
            ]
          }
        ],
        order: [['fecha_cita', 'DESC']]
      });

      console.log("📤 Citas encontradas:", citas?.map(c => c.toJSON()));

      return res.json(Array.isArray(citas) ? citas : []);
    } catch (error) {
      console.error('❌ [obtenerPorEstudiante] Error interno:', error);
      return res.status(500).json({ mensaje: 'Error al obtener citas del estudiante', detalle: error.message });
    }
  }
};

module.exports = citasEstudianteController;
