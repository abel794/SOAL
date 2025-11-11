// controllers/observacionesEstudianteController.js

const db = require('../../models');
const {
  Observacion,
  Estudiante,
  Acudiente,
  Persona,
  CategoriaObservacion,
  GravedadObservacion,
  Funcionario
} = db;

const observacionesEstudianteController = {

  // Obtener todas las observaciones de un estudiante
  async listar(req, res) {
    console.log('🚀 [listar] Inicio del controlador de observaciones del estudiante');
    console.log('🔐 Payload recibido desde el token:', req.usuario);

    try {
      // 1️⃣ Extraer el id_usuario del token
      const idUsuario = req.usuario?.id_usuario;
      console.log('🧩 [listar] id_usuario extraído del token:', idUsuario);

      if (!idUsuario) {
        console.warn('⚠️ [listar] Token inválido o usuario no autorizado');
        return res.status(401).json({ error: 'Token inválido o usuario no autorizado' });
      }

      // 2️⃣ Buscar el estudiante asociado a ese usuario
      console.log('🔎 [listar] Buscando estudiante con id_usuario =', idUsuario);
      const estudiante = await Estudiante.findOne({
        where: { id_usuario: idUsuario },
        include: [{ model: Persona, as: 'persona' }]
      });

      if (!estudiante) {
        console.warn(`⚠️ [listar] Estudiante no encontrado para id_usuario = ${idUsuario}`);
        return res.status(404).json({ error: 'Estudiante no encontrado para este usuario' });
      }

      console.log('✅ [listar] Estudiante encontrado:', {
        id_estudiante: estudiante.id_estudiante,
        nombre: estudiante.persona?.nombre,
        apellido: estudiante.persona?.apellido
      });

      const idEstudiante = estudiante.id_estudiante;

      // 3️⃣ Buscar observaciones filtradas por ese estudiante
      console.log('📚 [listar] Buscando observaciones para id_estudiante =', idEstudiante);

      const observaciones = await Observacion.findAll({
        where: { id_estudiante: idEstudiante },
        include: [
          {
            model: Estudiante,
            as: 'estudiante',
            include: [
              { model: Persona, as: 'persona' },
              {
                model: Acudiente,
                as: 'acudientes',
                through: { attributes: [] },
                include: [{ model: Persona, as: 'persona' }]
              }
            ]
          },
          { model: Funcionario, as: 'funcionario', include: [{ model: Persona, as: 'persona' }] },
          { model: CategoriaObservacion, as: 'categoria' },
          { model: GravedadObservacion, as: 'gravedad' }
        ],
        order: [['fecha', 'DESC']]
      });

      console.log(`📊 [listar] Total de observaciones encontradas: ${observaciones.length}`);

      if (!observaciones.length) {
        console.warn(`⚠️ [listar] No se encontraron observaciones para id_estudiante = ${idEstudiante}`);
      }

      // 4️⃣ Mapear el resultado de las observaciones
      const resultado = [];
      for (const obs of observaciones) {
        console.log('🔍 [listar] Procesando observación id:', obs.id_observacion);

        const acudientes = [];
        if (obs.estudiante?.acudientes?.length > 0) {
          console.log(`👨‍👩‍👧 [listar] ${obs.estudiante.acudientes.length} acudientes asociados`);
          for (const a of obs.estudiante.acudientes) {
            if (!a.persona) {
              console.warn(`⚠️ [listar] Acudiente sin datos de persona (id_acudiente = ${a.id_acudiente})`);
            }
            acudientes.push({
              nombre: a.persona?.nombre ?? "",
              apellido: a.persona?.apellido ?? ""
            });
          }
        }

        resultado.push({
          id: obs.id_observacion,
          titulo: obs.titulo ?? "observacion",
          descripcion: obs.descripcion ?? "Sin descripción",
          categoria: obs.categoria?.nombre ?? "Sin categoría",
          gravedad: obs.gravedad?.nombre ?? "Sin gravedad",
          grado: obs.estudiante?.grado ?? "N/A",
          fecha: obs.fecha ? new Date(obs.fecha).toISOString().split("T")[0] : "Sin fecha",
          estudiante: `${obs.estudiante?.persona?.nombre ?? ""} ${obs.estudiante?.persona?.apellido ?? ""}`.trim(),
          profesor: `${obs.funcionario?.persona?.nombre ?? ""} ${obs.funcionario?.persona?.apellido ?? ""}`.trim(),
          acudientes
        });
      }

      console.log(`✅ [listar] Mapeo completado. Total resultado: ${resultado.length}`);
      return res.json(resultado);

    } catch (error) {
      console.error('❌ [listar] Error al obtener observaciones del estudiante:', error);
      return res.status(500).json({
        error: 'Error al obtener observaciones',
        detalle: error.message
      });
    }
  }
};

module.exports = observacionesEstudianteController;
