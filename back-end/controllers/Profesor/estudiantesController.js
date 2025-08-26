// controllers/profesor/estudiantesController.js
const { Op } = require('sequelize');
const {
  FuncionarioGrado,
  EstudianteGrado,
  Estudiante,
  Grado,
  Persona,
} = require('../../models');

/**
 * GET /api/profesor/estudiantes
 * Query opcionales: nombre, apellido, numero_documento, grado, page, limit
 */
const obtenerEstudiantesAsignados = async (req, res) => {
  const {
    nombre,
    apellido,
    numero_documento,
    grado: filtroGrado,
    page = 1,
    limit = 25,
  } = req.query;

  // Ahora tomamos el ID del profesor desde el usuario autenticado
  const profesorId = req.user?.id_funcionario;

  if (!profesorId) {
    return res.status(401).json({ error: 'No autorizado o sin ID de profesor' });
  }

  const offset = (page - 1) * limit;

  try {
    const asignaciones = await FuncionarioGrado.findAll({
      where: {
        id_funcionario: profesorId,
        rol: 'Profesor titular',
      },
      include: {
        model: Grado,
        as: 'grado',
        where: filtroGrado ? { id_grado: filtroGrado } : undefined,
        include: {
          model: EstudianteGrado,
          as: 'estudiantesGrado',
          include: {
            model: Estudiante,
            as: 'estudianteAsignado',
            include: {
              model: Persona,
              as: 'persona',
              where: {
                ...(nombre && { nombre: { [Op.like]: `%${nombre}%` } }),
                ...(apellido && { apellido: { [Op.like]: `%${apellido}%` } }),
              },
            },
            where: {
              ...(numero_documento && { numero_documento: { [Op.like]: `%${numero_documento}%` } }),
            },
          },
        },
      },
    });

    // Extraer estudiantes únicos
    const temp = [];
    asignaciones.forEach(fg => {
      const estGrados = fg.grado?.estudiantesGrado || [];
      estGrados.forEach(eg => {
        if (eg.estudianteAsignado) temp.push(eg.estudianteAsignado);
      });
    });

    const estudiantes = Object.values(
      temp.reduce((acc, e) => {
        acc[e.id_estudiante] = e;
        return acc;
      }, {})
    );

    // Paginación manual
    const paginados = estudiantes.slice(offset, offset + Number(limit));

    return res.json({
      data: paginados,
      meta: {
        total: estudiantes.length,
        page: Number(page),
        limit: Number(limit),
      },
    });
  } catch (err) {
    console.error('Error obtenerEstudiantesAsignados:', err);
    return res.status(500).json({ error: 'Error obteniendo estudiantes asignados' });
  }
};

module.exports = { obtenerEstudiantesAsignados };
