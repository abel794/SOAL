// back-end/controllers/Profesor/observacionController.js
const { Observacion, Estudiante, Persona, CategoriaObservacion, GravedadObservacion } = require("../../models");

// 1️⃣ Obtener observaciones de un estudiante
const obtenerObservacionesPorEstudiante = async (req, res) => {
  try {
    const { idEstudiante } = req.params;

    const observaciones = await Observacion.findAll({
      where: { id_estudiante: idEstudiante },
      include: [
        { model: CategoriaObservacion, as: "categoria", attributes: ["nombre"] },
        { model: GravedadObservacion, as: "gravedad", attributes: ["nombre"] },
        { model: Estudiante, as: "estudiante", include: [{ model: Persona, as: "persona", attributes: ["nombre", "apellido"] }] },
      ],
      order: [["fecha", "DESC"]],
    });

    res.json({ success: true, data: observaciones });
  } catch (err) {
    console.error("Error obteniendo observaciones:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// 2️⃣ Registrar nueva observación
const crearObservacion = async (req, res) => {
  try {
    const { id_estudiante, id_funcionario, id_categoria, id_gravedad, descripcion } = req.body;

    const nuevaObs = await Observacion.create({
      id_estudiante,
      id_funcionario,
      id_categoria,
      id_gravedad,
      descripcion,
      fecha: new Date(),
    });

    res.json({ success: true, data: nuevaObs });
  } catch (err) {
    console.error("Error creando observación:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  obtenerObservacionesPorEstudiante,
  crearObservacion,
};
