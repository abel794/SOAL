const { Profesor } = require('../../models'); // ruta corregida

const profesorController = {
  obtenerTodos: async (req, res) => {
    try {
      const profesores = await Profesor.findAll();
      res.json(profesores);
    } catch (error) {
      res.status(500).json({ mensaje: error.message });
    }
  },
};

module.exports = profesorController;
