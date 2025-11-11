// controllers/observacionAcudienteController.js

const db = require('../../models');
const {
  Observacion,
  Estudiante,
  Acudiente,
  Persona,
  CategoriaObservacion,
  GravedadObservacion,
  EstudianteGrado,
  Grado,
} = db;
const { Op } = require('sequelize');

const calcularEdad = (fechaStr) => {
  if (!fechaStr) return null;
  const nacimiento = new Date(fechaStr);
  if (isNaN(nacimiento)) return null;
  const hoy = new Date();
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const m = hoy.getMonth() - nacimiento.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) edad--;
  return edad;
};

/**
 * Controller exclusivo para el rol Acudiente.
 * Devuelve:
 *   { success: true, data: { estudiantes: [...], observaciones: [...] } }
 */
const observacionAcudienteController = {
  async obtenerPorAcudiente(req, res) {
    try {
      // 1) Sacar el id_usuario del token
      const idUsuario = req.user?.id_usuario;
      if (!idUsuario) {
        return res
          .status(401)
          .json({ success: false, error: 'Token inválido o usuario no autorizado' });
      }

      // 2) Buscar el Acudiente asociado a ese usuario
      const acudiente = await Acudiente.findOne({
        where: { id_usuario: idUsuario },
        attributes: ['id_acudiente'],
      });

      if (!acudiente) {
        return res.json({
          success: true,
          data: { estudiantes: [], observaciones: [] },
        });
      }
      const idAcud = acudiente.id_acudiente;

      // -----  A) Traer observaciones del/los hijos del acudiente  -----
      const observacionesRaw = await Observacion.findAll({
        include: [
          {
            model: Estudiante,
            as: 'estudiante',
            required: true,
            include: [
              {
                model: Acudiente,
                as: 'acudientes',
                required: true,
                where: { id_acudiente: idAcud },
                through: { attributes: [] },
                attributes: [],
              },
              {
                model: Persona,
                as: 'persona',
                attributes: [
                  'numero_documento',
                  'nombre',
                  'apellido',
                  'fecha_nacimiento',
                ],
              },
            ],
            attributes: [
              'id_estudiante',
              'numero_documento',
              'id_eps',
              'id_estado_academico',
            ],
          },
          { model: CategoriaObservacion, as: 'categoria', attributes: ['nombre'] },
          { model: GravedadObservacion, as: 'gravedad', attributes: ['nombre'] },
        ],
        order: [['fecha', 'DESC']],
        raw: false,
        nest: true,
      });

      const observaciones = observacionesRaw.map((obs) => {
        const estudiante = obs.estudiante || {};
        const persona = estudiante.persona || {};

        return {
          id_observacion: obs.id_observacion,
          id_estudiante: estudiante.id_estudiante,
          estudianteNombre: persona.nombre || null,
          estudianteApellido: persona.apellido || null,
          estudianteNumeroDocumento: persona.numero_documento || null,
          grado: estudiante.grado || null,
          categoria: obs.categoria ? obs.categoria.nombre : null,
          gravedad: obs.gravedad ? obs.gravedad.nombre : null,
          descripcion: obs.descripcion,
          fecha: obs.fecha,
          titulo: obs.titulo,
        };
      });

      // -----  B) Traer TODOS los estudiantes asociados al acudiente -----
      const estudiantesRaw = await Estudiante.findAll({
        include: [
          {
            model: Acudiente,
            as: 'acudientes',
            required: true,
            where: { id_acudiente: idAcud },
            through: { attributes: [] },
            attributes: [],
          },
          {
            model: Persona,
            as: 'persona',
            attributes: [
              'numero_documento',
              'nombre',
              'apellido',
              'fecha_nacimiento',
            ],
          },
          {
            model: EstudianteGrado,
            as: 'gradosAsignados',
            required: false,
            where: { activo: true },
            attributes: [
              'id_estudiante_grado',
              'id_grado',
              'anio_academico',
              'activo',
            ],
            include: [
              {
                model: Grado,
                as: 'grado',
                attributes: ['id_grado', 'nombre_grado'],
              },
            ],
          },
        ],
        order: [['id_estudiante', 'ASC']],
        raw: false,
        nest: true,
      });

      const countMap = new Map();
      for (const o of observaciones) {
        const idEst = o.id_estudiante;
        if (!idEst) continue;
        countMap.set(idEst, (countMap.get(idEst) || 0) + 1);
      }

      const estudiantes = estudiantesRaw.map((est) => {
        const persona = est.persona || {};
        const gradoAsignado =
          Array.isArray(est.gradosAsignados) && est.gradosAsignados.length > 0
            ? est.gradosAsignados[0].grado?.nombre_grado
            : null;

        return {
          id_estudiante: est.id_estudiante,
          nombre: persona.nombre || null,
          apellido: persona.apellido || null,
          numero_documento: persona.numero_documento || null,
          edad: calcularEdad(persona.fecha_nacimiento),
          grado: gradoAsignado || 'Sin grado',
          observaciones: countMap.get(est.id_estudiante) || 0,
        };
      });

      return res.json({
        success: true,
        data: {
          estudiantes,
          observaciones,
        },
      });
    } catch (error) {
      console.error('❌ [obtenerPorAcudiente] Error interno:', error);
      return res.status(500).json({
        success: false,
        error: 'Error al obtener observaciones por acudiente',
        detalle: error.message,
      });
    }
  },

  // 🔹 Nuevo método (trae SOLO las observaciones de un estudiante)
  async obtenerPorEstudiante(req, res) {
    try {
      const { idEstudiante } = req.params;

      if (!idEstudiante) {
        return res.status(400).json({ success: false, error: "Falta idEstudiante en la URL" });
      }

      const observaciones = await Observacion.findAll({
        where: { id_estudiante: idEstudiante },
        include: [
          {
            model: Estudiante,
            as: "estudiante",
            include: [
              {
                model: Persona,
                as: "persona",
                attributes: ["nombre", "apellido", "numero_documento"]
              }
            ]
          },
          { model: CategoriaObservacion, as: "categoria", attributes: ["nombre"] },
          { model: GravedadObservacion, as: "gravedad", attributes: ["nombre"] },
        ],
        order: [["fecha", "DESC"]],
      });

      const resultado = observaciones.map(obs => ({
        id_observacion: obs.id_observacion,
        descripcion: obs.descripcion,
        fecha: obs.fecha,
        titulo: obs.titulo,
        categoria: obs.categoria?.nombre,
        gravedad: obs.gravedad?.nombre,
        estudiante: {
          id: obs.estudiante?.id_estudiante,
          nombre: obs.estudiante?.persona?.nombre,
          apellido: obs.estudiante?.persona?.apellido,
        }
      }));

      return res.json({ success: true, data: resultado });
    } catch (error) {
      console.error("❌ [obtenerPorEstudiante] Error interno:", error);
      return res.status(500).json({
        success: false,
        error: "Error al obtener observaciones del estudiante",
        detalle: error.message,
      });
    }
  }
};

module.exports = observacionAcudienteController;
