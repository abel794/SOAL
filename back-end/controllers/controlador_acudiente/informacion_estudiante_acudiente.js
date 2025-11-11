const { 
  Estudiante, 
  Persona, 
  Grado, 
  Observacion, 
  Asistencia, 
  EstudianteAcudiente, 
  EstudianteGrado, 
  Acudiente 
} = require("../../models");

// 🧠 Utilidad para armar array de estudiantes formateados
async function formatearEstudiantes(relaciones) {
  const estudiantesMap = new Map();

  for (const relacion of relaciones) {
    const estudiante = relacion.estudiante;
    if (!estudiante) continue;

    if (!estudiantesMap.has(estudiante.id_estudiante)) {
      const persona = estudiante.persona || {};
      const nacimiento = persona.fecha_nacimiento ? new Date(persona.fecha_nacimiento) : null;
      const hoy = new Date();
      let edad = null;

      if (nacimiento) {
        edad = hoy.getFullYear() - nacimiento.getFullYear();
        const m = hoy.getMonth() - nacimiento.getMonth();
        if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
          edad--;
        }
      }

      // Obtener observaciones
      const observaciones = estudiante.observaciones ? estudiante.observaciones.length : 0;

      // 🔹 Traer asistencias con sus fechas
      const asistencias = await Asistencia.findAll({
        where: { id_estudiante: estudiante.id_estudiante },
        attributes: ['fecha'] // solo traer la fecha
      });

      estudiantesMap.set(estudiante.id_estudiante, {
        id_estudiante: estudiante.id_estudiante,
        nombre: persona.nombre || "",
        apellido: persona.apellido || "",
        documento: persona.numero_documento || "No definido",
        edad: edad ?? "No definido",
        grado: estudiante.gradosAsignados.length
          ? estudiante.gradosAsignados[0].grado.nombre_grado
          : "Sin grado",
        observaciones,
        asistencias: asistencias.length,
        fechasAsistencias: asistencias.map(a => a.fecha)
      });
    }
  }

  const estudiantes = Array.from(estudiantesMap.values());
  return {
    totalEstudiantes: estudiantes.length,
    estudiantes
  };
}

// 📌 1. Obtener estudiantes por token
async function obtenerEstudiantesPorToken(req, res) {
  try {
    const idUsuario = req.user?.id_usuario;
    if (!idUsuario) {
      return res.status(401).json({ success: false, message: "Token inválido" });
    }

    const acudiente = await Acudiente.findOne({ where: { id_usuario: idUsuario } });
    if (!acudiente) {
      return res.json({ success: true, totalEstudiantes: 0, estudiantes: [] });
    }

    const relaciones = await EstudianteAcudiente.findAll({
      where: { id_acudiente: acudiente.id_acudiente },
      include: [
        {
          model: Estudiante,
          as: "estudiante",
          include: [
            { model: Persona, as: "persona", attributes: ["nombre", "apellido", "numero_documento", "fecha_nacimiento"] },
            { model: EstudianteGrado, as: "gradosAsignados", include: [{ model: Grado, as: "grado", attributes: ["nombre_grado"] }] },
            { model: Observacion, as: "observaciones", attributes: ["id_observacion"] },
          ],
        },
      ],
    });

    const resultado = await formatearEstudiantes(relaciones);
    res.json({ success: true, ...resultado });
  } catch (error) {
    console.error("❌ [obtenerEstudiantesPorToken] Error:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
}

// 📌 2. Obtener estudiantes por ID de acudiente
async function obtenerEstudiantesPorId(req, res) {
  try {
    const { idAcudiente } = req.params;

    const relaciones = await EstudianteAcudiente.findAll({
      where: { id_acudiente: idAcudiente },
      include: [
        {
          model: Estudiante,
          as: "estudiante",
          include: [
            { model: Persona, as: "persona", attributes: ["nombre", "apellido", "numero_documento", "fecha_nacimiento"] },
            { model: EstudianteGrado, as: "gradosAsignados", include: [{ model: Grado, as: "grado", attributes: ["nombre_grado"] }] },
            { model: Observacion, as: "observaciones", attributes: ["id_observacion"] },
          ],
        },
      ],
    });

    const resultado = await formatearEstudiantes(relaciones);
    res.json({ success: true, ...resultado });
  } catch (error) {
    console.error("❌ [obtenerEstudiantesPorId] Error:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
}

module.exports = { obtenerEstudiantesPorToken, obtenerEstudiantesPorId };
