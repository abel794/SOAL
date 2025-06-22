const { Cita } = require('../models');


// Crear nueva cita
exports.crearCita = async (req, res) => {
  try {
    const nuevaCita = await Cita.create(req.body);
    res.status(201).json({ mensaje: 'Cita creada', cita: nuevaCita });
  } catch (error) {
    console.error('Error al crear cita:', error);
    res.status(500).json({ mensaje: 'Error al crear cita' });
  }
};

// Contar total de citas
exports.contarCitas = async (req, res) => {
  try {
    const total = await Cita.count();
    res.json({ totalCitas: total });
  } catch (error) {
    console.error('Error al contar citas:', error);
    res.status(500).json({ mensaje: 'Error al contar citas' });
  }
};

// Obtener todas las citas
exports.obtenerCitas = async (req, res) => {
  try {
    const citas = await Cita.findAll();
    res.json(citas);
  } catch (error) {
    console.error('Error al obtener citas:', error);
    res.status(500).json({ mensaje: 'Error al obtener citas' });
  }
};
