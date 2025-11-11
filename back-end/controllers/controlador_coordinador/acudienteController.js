// Importamos los modelos y herramientas necesarias
const db = require('../../models');
const { Op } = require('sequelize');

// Desestructuramos los modelos necesarios
const Acudiente = db.Acudiente;
const Estudiante = db.Estudiante;

// Controlador de Acudiente
const acudienteController = {

  // ✅ Obtener todos los acudientes con relaciones
  async obtenerTodos(req, res) {
    try {
      const lista = await Acudiente.findAll({
        include: [
          'persona',
          'usuario',
          'relacion',
          {
            model: Estudiante,
            as: 'estudiantes', // Alias de la relación belongsToMany
            include: ['persona', 'usuario', 'estadoAcademico', 'eps'] // Puedes incluir más detalles del estudiante
          }
        ]
      });
      res.json(lista);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los acudientes', detalle: error.message });
    }
  },

  // ✅ Obtener un acudiente por ID con relaciones
  async obtenerPorId(req, res) {
    const id = req.params.id;
    try {
      const acudiente = await Acudiente.findByPk(id, {
        include: [
          'persona',
          'usuario',
          'relacion',
          {
            model: Estudiante,
            as: 'estudiantes',
            include: ['persona', 'usuario', 'estadoAcademico', 'eps']
          }
        ]
      });

      if (!acudiente) {
        return res.status(404).json({ error: 'Acudiente no encontrado' });
      }

      res.json(acudiente);
    } catch (error) {
      res.status(500).json({ error: 'Error al buscar acudiente', detalle: error.message });
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
      res.status(400).json({ error: 'Error al actualizar el acudiente', detalle: error.message });
    }
  },

  // ✅ Eliminar un acudiente por ID
  async eliminar(req, res) {
    const id = req.params.id;
    try {
      const eliminado = await Acudiente.destroy({
        where: { id_acudiente: id }
      });

      if (eliminado === 0) {
        res.status(404).json({ error: 'Acudiente no encontrado' });
      } else {
        res.json({ mensaje: 'Acudiente eliminado correctamente' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar el acudiente', detalle: error.message });
    }
  },

  // ✅ Obtener los estudiantes asignados a un acudiente
  async estudiantesDeAcudiente(req, res) {
    const id = req.params.id;
    try {
      const acudiente = await Acudiente.findByPk(id, {
        include: [
          {
            model: Estudiante,
            as: 'estudiantes',
            include: ['persona', 'usuario', 'estadoAcademico', 'eps']
          }
        ]
      });

      if (!acudiente) {
        return res.status(404).json({ error: 'Acudiente no encontrado' });
      }

      res.json(acudiente.estudiantes);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener estudiantes del acudiente', detalle: error.message });
    }
  },

  // 🔍 Buscar acudientes por nombre (usa relación con persona)
  async buscarPorNombre(req, res) {
    const { nombre } = req.query;
    try {
      const resultados = await Acudiente.findAll({
        include: [
          {
            association: 'persona',
            where: {
              nombre: { [Op.like]: `%${nombre}%` } // Filtra por nombre en la tabla persona
            }
          },
          'usuario',
          'relacion'
        ]
      });

      if (resultados.length === 0) {
        return res.status(404).json({ mensaje: 'No se encontraron coincidencias' });
      }

      res.json(resultados);
    } catch (error) {
      res.status(500).json({ error: 'Error al buscar acudientes', detalle: error.message });
    }
  }

};

// Exportamos el controlador
module.exports = acudienteController;
