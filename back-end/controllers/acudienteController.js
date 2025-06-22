const db = require('../models');
const Acudiente = db.Acudiente;
const Estudiante = db.Estudiante;
const { Op } = require('sequelize');

const acudienteController = {
  // ✅ Obtener todos los acudientes
  async obtenerTodos(req, res) {
    try {
      const lista = await Acudiente.findAll();
      res.json(lista);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los acudientes' });
    }
  },

  // ✅ Obtener un acudiente por ID
  async obtenerPorId(req, res) {
    const id = req.params.id;
    try {
      const acudiente = await Acudiente.findByPk(id);
      if (acudiente) {
        res.json(acudiente);
      } else {
        res.status(404).json({ error: 'Acudiente no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al buscar acudiente' });
    }
  },

  // ✅ Crear un nuevo acudiente
  async crear(req, res) {
    try {
      const nuevo = await Acudiente.create(req.body);
      res.status(201).json(nuevo);
    } catch (error) {
      res.status(400).json({ error: 'Error al crear el acudiente', detalle: error.message });
    }
  },

  // ✅ Actualizar un acudiente existente
  async actualizar(req, res) {
    const id = req.params.id;
    try {
      const [filas] = await Acudiente.update(req.body, {
        where: { id_acudiente: id }
      });

      if (filas === 0) {
        res.status(404).json({ error: 'Acudiente no encontrado o sin cambios' });
      } else {
        res.json({ mensaje: 'Acudiente actualizado correctamente' });
      }
    } catch (error) {
      res.status(400).json({ error: 'Error al actualizar el acudiente' });
    }
  },

  // ✅ Eliminar un acudiente
  async eliminar(req, res) {
    const id = req.params.id;
    try {
      const filas = await Acudiente.destroy({
        where: { id_acudiente: id }
      });

      if (filas === 0) {
        res.status(404).json({ error: 'Acudiente no encontrado' });
      } else {
        res.json({ mensaje: 'Acudiente eliminado correctamente' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar el acudiente' });
    }
  },

  // ✅ Obtener los estudiantes asignados a un acudiente
  async estudiantesDeAcudiente(req, res) {
    const id = req.params.id;
    try {
      const acudiente = await Acudiente.findByPk(id, {
        include: {
          model: Estudiante
        }
      });

      if (!acudiente) {
        return res.status(404).json({ error: 'Acudiente no encontrado' });
      }

      res.json(acudiente);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener estudiantes del acudiente' });
    }
  },

  // 🔍 Buscar acudientes por nombre
  async buscarPorNombre(req, res) {
    const { nombre } = req.query;
    try {
      const resultados = await Acudiente.findAll({
        where: {
          nombre: { [Op.like]: `%${nombre}%` }
        }
      });

      if (resultados.length === 0) {
        res.status(404).json({ mensaje: 'No se encontraron coincidencias' });
      } else {
        res.json(resultados);
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al buscar acudientes' });
    }
  }
};

module.exports = acudienteController;
