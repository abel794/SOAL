// back-end/controllers/Profesor/observacionController.js
const { Observacion, Estudiante, Persona, CategoriaObservacion, GravedadObservacion, EstudianteAcudiente, Acudiente } = require("../../models");
const { enviarCorreo } = require("../../services/emailService"); 
// 1️⃣ Obtener observaciones de un estudiante
const obtenerObservacionesPorEstudiante = async (req, res) => {
  try {
    const { idEstudiante } = req.params;

    const observaciones = await Observacion.findAll({
      where: { id_estudiante: idEstudiante },
      include: [
        { model: CategoriaObservacion, as: "categoria", attributes: ["nombre"] },
        { model: GravedadObservacion, as: "gravedad", attributes: ["nombre"] },
        { 
          model: Estudiante, 
          as: "estudiante", 
          include: [{ model: Persona, as: "persona", attributes: ["nombre", "apellido"] }] 
        },
      ],
      order: [["fecha", "DESC"]],
    });

    res.json({ success: true, data: observaciones });
  } catch (err) {
    console.error("Error obteniendo observaciones:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// 2️⃣ Registrar nueva observación y notificar
const crearObservacion = async (req, res) => {
  try {
    const { id_estudiante, id_funcionario, id_categoria, id_gravedad, descripcion } = req.body;

    // Guardar observación
    const nuevaObs = await Observacion.create({
      id_estudiante,
      id_funcionario,
      id_categoria,
      id_gravedad,
      descripcion,
      fecha: new Date(),
    });

    // Buscar acudiente del estudiante
    const acudienteData = await EstudianteAcudiente.findOne({
      where: { id_estudiante },
      include: [
        {
          model: Acudiente,
          as: "acudiente",
          include: [
            { model: Persona, as: "persona", attributes: ["nombre", "apellido", "correo"] }
          ]
        }
      ]
    });

    if (acudienteData && acudienteData.acudiente?.persona?.correo) {
      const correo = acudienteData.acudiente.persona.correo;
      const nombre = acudienteData.acudiente.persona.nombre;

      // Enviar correo con el servicio
      await enviarCorreo(
        correo,
        "Nueva observación registrada",
        `Hola ${nombre},\n\nSe ha registrado una nueva observación para su acudido.\n\nDescripción: ${descripcion}\n\nSOAL - Sistema de Observador del Alumno`
      );
    }

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
