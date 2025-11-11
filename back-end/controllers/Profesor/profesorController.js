const { Funcionario, Persona, Usuario } = require('../../models');

const profesorController = {
  obtenerPorId: async (req, res) => {
    const { id } = req.params;
    try {
      const profesor = await Funcionario.findOne({
        where: { id_funcionario: id },
        include: [
          {
            model: Persona,
            as: 'persona',
            attributes: ['nombre', 'apellido', 'correo', 'foto']
          },
          {
            model: Usuario,
            as: 'usuario',
            attributes: ['username']
          }
        ]
      });

      if (!profesor) return res.status(404).json({ mensaje: 'Profesor no encontrado' });

      res.json(profesor);
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: 'Error al obtener el profesor' });
    }
  }
};

module.exports = profesorController;
