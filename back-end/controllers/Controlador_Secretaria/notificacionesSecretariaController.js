const { Notificacion } = require("../../models");  // Asegúrate de que tienes el modelo de Notificación correctamente configurado en Sequelize

// Controlador para obtener las notificaciones con paginación
const obtenerNotificaciones = async (req, res) => {
  console.log("Obteniendo notificaciones");
  try {
    // Extracción de los parámetros de paginación: limit y offset
    const { limit = 10, offset = 0 } = req.query;

    // Validar que limit y offset sean números válidos
    if (isNaN(limit) || isNaN(offset)) {
      return res.status(400).json({ error: "El parámetro 'limit' y 'offset' deben ser números válidos." });
    }

    // Buscar las notificaciones con paginación
    const notificaciones = await Notificacion.findAndCountAll({
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    // Calcular el número total de páginas
    const totalPages = Math.ceil(notificaciones.count / limit);

    // Retornar las notificaciones y el total de páginas para la paginación
    res.status(200).json({
      notificaciones: notificaciones.rows,  // Las filas de las notificaciones
      totalPages,  // Número total de páginas
    });
  } catch (error) {
    console.error("Error al obtener notificaciones:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Controlador para crear una nueva notificación
const crearNotificacion = async (req, res) => {
  console.log("Creando notificación");
  try {
    const { tipo, mensaje, id_acudiente, id_canal, id_estado_notificacion } = req.body;

    // Validación del mensaje
    if (!mensaje || mensaje.trim() === "") {
      return res.status(400).json({ error: "El mensaje es obligatorio" });
    }

    // Valores por defecto para los ID si no se proporcionan
    const acudienteId = id_acudiente || 1;  // Valor por defecto si no se manda
    const canalId = id_canal || 1;
    const estadoId = id_estado_notificacion || 1;

    // Crear la nueva notificación
    const nuevaNotificacion = await Notificacion.create({
      tipo,
      mensaje,
      fecha: new Date(),
      id_acudiente: acudienteId,
      id_canal: canalId,
      id_estado_notificacion: estadoId,
    });

    // Retornar la nueva notificación creada
    res.status(201).json(nuevaNotificacion);
  } catch (error) {
    console.error("Error al crear notificación:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

module.exports = { crearNotificacion, obtenerNotificaciones };
