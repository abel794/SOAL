const db = require('../models');                     // Importamos todos los modelos
const EstadoAcademico = db.EstadoAcademico;          // Modelo específico
const Estudiante = db.Estudiante;                    // Para incluir estudiantes relacionados
const { Op } = require('sequelize');                 // Para búsquedas avanzadas

const estadoAcademicoController = {

  // ✅ Crear nuevo estado académico
  async crear(req, res) {
    const { nombre } = req.body;

    // Validación básica
    if (!nombre || nombre.trim() === "") {
      return res.status(400).json({ error: 'El nombre es obligatorio' });
    }

    try {
      const creado = await EstadoAcademico.create({ nombre });
      res.status(201).json({ mensaje: 'Estado académico creado', estado: creado });
    } catch (error) {
      res.status(500).json({ error: 'Error al crear estado académico', detalle: error.message });
    }
  },

  // 📄 Obtener todos los estados académicos
  async obtenerTodos(req, res) {
    try {
      const lista = await EstadoAcademico.findAll();
      res.json(lista);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los estados académicos' });
    }
  },

  // 🔍 Buscar por ID
  async obtenerPorId(req, res) {
    const { id } = req.params;

    try {
      const estado = await EstadoAcademico.findByPk(id);
      if (!estado) {
        return res.status(404).json({ error: 'Estado académico no encontrado' });
      }
      res.json(estado);
    } catch (error) {
      res.status(500).json({ error: 'Error al buscar el estado académico' });
    }
  },

  // 🔍 Buscar por nombre (parcial o exacto)
  async buscarPorNombre(req, res) {
    const { nombre } = req.query;

    if (!nombre) {
      return res.status(400).json({ error: 'Debe proporcionar un nombre para buscar' });
    }

    try {
      const resultados = await EstadoAcademico.findAll({
        where: {
          nombre: { [Op.like]: `%${nombre}%` }
        }
      });

      res.json(resultados);
    } catch (error) {
      res.status(500).json({ error: 'Error al buscar por nombre' });
    }
  },

  // 🧮 Contar estados académicos registrados
  async contar(req, res) {
    try {
      const total = await EstadoAcademico.count();
      res.json({ total });
    } catch (error) {
      res.status(500).json({ error: 'Error al contar los estados académicos' });
    }
  },

  // ✏️ Actualizar estado académico
  async actualizar(req, res) {
    const { id } = req.params;
    const { nombre } = req.body;

    if (!nombre || nombre.trim() === "") {
      return res.status(400).json({ error: 'El nombre no puede estar vacío' });
    }

    try {
      const [actualizados] = await EstadoAcademico.update({ nombre }, { where: { id_estado_academico: id } });

      if (actualizados === 0) {
        return res.status(404).json({ error: 'Estado académico no encontrado o sin cambios' });
      }

      res.json({ mensaje: 'Estado académico actualizado correctamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar el estado académico' });
    }
  },

  // ❌ Eliminar estado académico
  async eliminar(req, res) {
    const { id } = req.params;

    try {
      const eliminados = await EstadoAcademico.destroy({ where: { id_estado_academico: id } });

      if (eliminados === 0) {
        return res.status(404).json({ error: 'Estado académico no encontrado' });
      }

      res.json({ mensaje: 'Estado académico eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar el estado académico' });
    }
  },

  // 👥 Ver estudiantes asociados a un estado académico
  async estudiantesPorEstado(req, res) {
    const { id } = req.params;

    try {
      const estado = await EstadoAcademico.findByPk(id, {
        include: {
          model: Estudiante,
          as: 'estudiantes'
        }
      });

      if (!estado) {
        return res.status(404).json({ error: 'Estado académico no encontrado' });
      }

      res.json(estado.estudiantes);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los estudiantes' });
    }
  }
};

module.exports = estadoAcademicoController;
