// back-end/controllers/Profesor/estudiantesController.js

const { FuncionarioGrado, Grado, EstudianteGrado, Estudiante, Persona } = require("../../models");

const obtenerEstudiantesAsignados = async (req, res) => {
  try {
    const { id } = req.params;

    const asignaciones = await FuncionarioGrado.findAll({
      where: { id_funcionario: id },
      include: [
        {
          model: Grado,
          as: "grado",
          include: [
            {
              model: EstudianteGrado,
              as: "estudiantesGrado",
              include: [
                {
                  model: Estudiante,
                  as: "estudianteAsignado",
                  include: [
                    {
                      model: Persona,
                      as: "persona",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });

    // 👉 Convertimos las asignaciones en un arreglo de estudiantes + grado
    const temp = [];
    asignaciones.forEach((fg) => {
      const estGrados = fg.grado?.estudiantesGrado || [];
      estGrados.forEach((eg) => {
        if (eg.estudianteAsignado) {
          temp.push({
            id_estudiante: eg.estudianteAsignado.id_estudiante,
            numero_documento: eg.estudianteAsignado.numero_documento,
            persona: eg.estudianteAsignado.persona,
            grado: fg.grado.nombre_grado, // 👈 Nombre del grado
          });
        }
      });
    });

    // 👉 Eliminamos duplicados (diferenciando por estudiante + grado)
    const estudiantes = Object.values(
      temp.reduce((acc, e) => {
        acc[e.id_estudiante + "-" + e.grado] = e;
        return acc;
      }, {})
    );

    res.json({ success: true, data: estudiantes });
  } catch (error) {
    console.error("Error en obtenerEstudiantesPorProfesor:", error);
    res.status(500).json({ success: false, error: "Error obteniendo estudiantes del profesor" });
  }
};

module.exports = { obtenerEstudiantesAsignados };
