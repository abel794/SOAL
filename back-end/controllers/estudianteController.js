const db = require('../models');
const Estudiante = db.Estudiante;
const Grado = db.Grado;
const Estudiantegrado = db.Estudiantegrado;
const { Op } = require('sequelize');

const estudianteController = {
  // Obtener todos los estudiantes
  async obtenerTodos(req, res) {
    try {
      const estudiantes = await Estudiante.findAll();
      //console.log(estudiantes)
      res.json(estudiantes);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener estudiantes' });
    }
  },
  // ✅ Devuelve solo el total de estudiantes
  async obtenerTotalestudiantes(req, res) {
    try {
      const total = await Estudiante.count(); // Cuenta cuántos registros hay en la tabla
      res.json({ total }); // Devuelve un objeto: { total: 240 }
    } catch (error) {
      console.error('Error al contar estudiantes:', error);
      res.status(500).json({ error: 'Error al obtener total de estudiantes' });
    }
  },


  // Obtener un estudiante por ID
async obtenerPorId(req, res) {
  const id = req.params.id;
  try {
    const estudiante = await Estudiante.findByPk(id);
    if (estudiante) {
      res.json(estudiante);
    } else {
      res.status(404).json({ error: 'Estudiante no encontrado' });
    }
  } catch (error) {
    console.error('Error al buscar el estudiante:', error);
    res.status(500).json({ error: 'Error al buscar el estudiante' });
  }
},

  // Crear un nuevo estudiante
  async crear(req, res) {
    try {
      const nuevo = await Estudiante.create(req.body);
      res.status(201).json(nuevo);
    } catch (error) {
      res.status(400).json({ error: 'Error al crear el estudiante', detalle: error.message });
    }
  },

  // Actualizar estudiante
  async actualizar(req, res) {
    const id = req.params.id;
    try {
      const [filasActualizadas] = await Estudiante.update(req.body, {
        where: { id_estudiante: id }
      });
      if (filasActualizadas === 0) {
        res.status(404).json({ error: 'Estudiante no encontrado o sin cambios' });
      } else {
        res.json({ mensaje: 'Estudiante actualizado correctamente' });
      }
    } catch (error) {
      res.status(400).json({ error: 'Error al actualizar el estudiante' });
    }
  },

  // Eliminar estudiante
  async eliminar(req, res) {
    const id = req.params.id;
    try {
      const filasEliminadas = await Estudiante.destroy({
        where: { id_estudiante: id }
      });
      if (filasEliminadas === 0) {
        res.status(404).json({ error: 'Estudiante no encontrado' });
      } else {
        res.json({ mensaje: 'Estudiante eliminado correctamente' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar el estudiante' });
    }
  },

  // Buscar por nombre, número de documento o grado
  async buscar(req, res) {
    const { termino } = req.query;

    try {
      const estudiantes = await Estudiante.findAll({
        where: {
          [Op.or]: [
            { nombre: { [Op.like]: `%${termino}%` } },
            { numero_documento: { [Op.like]: `%${termino}%` } }
          ]
        }
      });

      if (estudiantes.length === 0) {
        res.status(404).json({ mensaje: 'No se encontraron coincidencias' });
      } else {
        res.json(estudiantes);
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al buscar estudiantes' });
    }
  },

  // Contar estudiantes por grado
  async contarPorGrado(req, res) {
    const nombreGrado = req.params.nombre;
    try {
      const grado = await Grado.findOne({ where: { nombre_grado: nombreGrado } });
      if (!grado) return res.status(404).json({ error: 'Grado no encontrado' });

      const total = await Estudiantegrado.count({
        where: { id_grado: grado.id_grado }
      });


      res.json({ total_estudiantes: total });
    } catch (error) {
      console.error('Error al contar estudiantes por grado:', error);
      res.status(500).json({ error: 'Error al contar estudiantes por grado' });
    }
  }
};

module.exports = estudianteController;
