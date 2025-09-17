// back-end/controllers/Profesor/estudiantesController.js
const { FuncionarioGrado, Grado, EstudianteGrado, Estudiante, Persona } = require("../../models");

// 1️⃣ Obtener estudiantes asignados a un profesor, opcionalmente filtrados por grado
const obtenerEstudiantesAsignados = async (req, res) => {
  try {
    const { id } = req.params;

    const asignaciones = await FuncionarioGrado.findAll({
      where: { id_funcionario: id },
      include: [
        {
          model: Grado,
          as: "grado",
          attributes: ["id_grado", "nombre_grado"],
          include: [
            {
              model: EstudianteGrado,
              as: "estudiantesGrado",
              include: [
                {
                  model: Estudiante,
                  as: "estudianteAsignado",
                  include: [{ model: Persona, as: "persona" }],
                },
              ],
            },
          ],
        },
      ],
    });

    const temp = [];
    asignaciones.forEach((fg) => {
      const estGrados = fg.grado?.estudiantesGrado || [];
      estGrados.forEach((eg) => {
        if (eg.estudianteAsignado) {
          temp.push({
            id_estudiante: eg.estudianteAsignado.id_estudiante,
            numero_documento: eg.estudianteAsignado.numero_documento,
            persona: eg.estudianteAsignado.persona,
            grado: fg.grado.nombre_grado,
          });
        }
      });
    });

    // Eliminar duplicados
    const estudiantes = Object.values(
      temp.reduce((acc, e) => {
        acc[e.id_estudiante + "-" + e.grado] = e;
        return acc;
      }, {})
    );

    res.json({ success: true, data: estudiantes });
  } catch (error) {
    console.error("Error en obtenerEstudiantesAsignados:", error);
    res.status(500).json({ success: false, error: "Error obteniendo estudiantes del profesor" });
  }
};

// 2️⃣ Obtener grados de un profesor
const obtenerGradosPorProfesor = async (req, res) => {
  try {
    const { id } = req.params;

    const asignaciones = await FuncionarioGrado.findAll({
      where: { id_funcionario: id },
      include: [
        {
          model: Grado,
          as: "grado",
          attributes: ["id_grado", "nombre_grado"],
        },
      ],
    });

    const grados = [];
    const seen = new Set();
    asignaciones.forEach((fg) => {
      const g = fg.grado;
      if (g && !seen.has(g.id_grado)) {
        seen.add(g.id_grado);
        grados.push({ id_grado: g.id_grado, nombre: g.nombre_grado });
      }
    });

    res.json({ success: true, data: grados });
  } catch (error) {
    console.error("Error obteniendo grados del profesor:", error);
    res.status(500).json({ success: false, error: "Error obteniendo grados" });
  }
};

// 3️⃣ Obtener estudiantes de un grado específico
const obtenerEstudiantesPorGrado = async (req, res) => {
  try {
    const { idGrado } = req.params;

    const estudiantesGrado = await EstudianteGrado.findAll({
      where: { id_grado: idGrado },
      include: [
        {
          model: Estudiante,
          as: "estudianteAsignado",
          include: [{ model: Persona, as: "persona", attributes: ["nombre", "apellido"] }],
        },
      ],
    });

    const estudiantes = estudiantesGrado.map((eg) => ({
      id_estudiante: eg.estudianteAsignado.id_estudiante,
      numero_documento: eg.estudianteAsignado.numero_documento,
      persona: eg.estudianteAsignado.persona,
    }));

    res.json({ success: true, data: estudiantes });
  } catch (err) {
    console.error("Error obteniendo estudiantes por grado:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  obtenerEstudiantesAsignados,
  obtenerGradosPorProfesor,
  obtenerEstudiantesPorGrado,
};
