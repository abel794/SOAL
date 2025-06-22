const db = require('../models');
const Profesor = db.Profesor;
const Grado = db.Grado;
const ProfesorGrado = db.ProfesorGrado;
const { Op } = require('sequelize');

const profesorController = {
  // ✅ Obtener todos los profesores
  async obtenerTodos(req, res) {
    try {
      const profesores = await Profesor.findAll();
      res.json(profesores);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los profesores' });
    }
  },

  // ✅ Obtener profesor por ID
  async obtenerPorId(req, res) {
    const id = req.params.id;
    try {
      const profesor = await Profesor.findByPk(id);
      if (profesor) {
        res.json(profesor);
      } else {
        res.status(404).json({ error: 'Profesor no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al buscar el profesor' });
    }
  },

  // ✅ Crear un nuevo profesor
  async crear(req, res) {
    try {
      const nuevo = await Profesor.create(req.body);
      res.status(201).json(nuevo);
    } catch (error) {
      res.status(400).json({ error: 'Error al crear el profesor', detalle: error.message });
    }
  },

  // ✅ Actualizar un profesor
  async actualizar(req, res) {
    const id = req.params.id;
    try {
      const [filasActualizadas] = await Profesor.update(req.body, {
        where: { id_profesor: id }
      });

      if (filasActualizadas === 0) {
        res.status(404).json({ error: 'Profesor no encontrado o sin cambios' });
      } else {
        res.json({ mensaje: 'Profesor actualizado correctamente' });
      }
    } catch (error) {
      res.status(400).json({ error: 'Error al actualizar el profesor' });
    }
  },

  // ✅ Eliminar un profesor
  async eliminar(req, res) {
    const id = req.params.id;
    try {
      const filasEliminadas = await Profesor.destroy({
        where: { id_profesor: id }
      });

      if (filasEliminadas === 0) {
        res.status(404).json({ error: 'Profesor no encontrado' });
      } else {
        res.json({ mensaje: 'Profesor eliminado correctamente' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar el profesor' });
    }
  },

  // 🔍 Buscar profesor por nombre
  async buscarPorNombre(req, res) {
    const { nombre } = req.query;
    try {
      const profesores = await Profesor.findAll({
        where: {
          nombre: { [Op.like]: `%${nombre}%` }
        }
      });

      if (profesores.length === 0) {
        res.status(404).json({ mensaje: 'No se encontraron coincidencias' });
      } else {
        res.json(profesores);
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al buscar profesores' });
    }
  },

  // 📚 Asignar grado a un profesor
  async asignarGrado(req, res) {
    const { id_profesor, id_grado } = req.body;

    try {
      const profesor = await Profesor.findByPk(id_profesor);
      const grado = await Grado.findByPk(id_grado);

      if (!profesor || !grado) {
        return res.status(404).json({ error: 'Profesor o grado no encontrado' });
      }

      await ProfesorGrado.create({ id_profesor, id_grado });

      res.status(201).json({ mensaje: 'Grado asignado al profesor correctamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al asignar el grado', detalle: error.message });
    }
  },

  // ✅ Obtener grados asignados a un profesor
  async gradosAsignados(req, res) {
    const id_profesor = req.params.id;
    try {
      const grados = await ProfesorGrado.findAll({
        where: { id_profesor },
        include: [{ model: Grado }]
      });
      res.json(grados);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los grados asignados' });
    }
  }
};

module.exports = profesorController;
