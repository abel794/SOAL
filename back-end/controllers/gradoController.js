const db = require('../models');
const Grado = db.Grado;
const EstudianteGrado = db.EstudianteGrado;
const FuncionarioGrado = db.FuncionarioGrado;
const { Op } = require('sequelize');

const gradoController = {

  // ✅ Listar todos los grados
  async listarTodos(req, res) {
    try {
      const grados = await Grado.findAll();
      res.json(grados);
    } catch (error) {
      console.error("Error al listar grados:", error);
      res.status(500).json({ error: 'Error al obtener grados', detalle: error.message });
    }
  },
  // ✅ Obtener grado por ID
async obtenerPorId(req, res) {
  const { id } = req.params;

  try {
    const grado = await Grado.findByPk(id);
    if (!grado) {
      return res.status(404).json({ error: 'Grado no encontrado' });
    }

    res.json(grado);
  } catch (error) {
    console.error("Error al obtener grado por ID:", error);
    res.status(500).json({ error: 'Error al obtener grado', detalle: error.message });
  }
},


  // ✅ Buscar grado por nombre
  async buscarPorNombre(req, res) {
    const { nombre } = req.query;

    if (!nombre) return res.status(400).json({ error: 'Debe enviar el parámetro "nombre"' });

    try {
      const grados = await Grado.findAll({
        where: {
          nombre_grado: { [Op.like]: `%${nombre}%` }
        }
      });

      res.json(grados);
    } catch (error) {
      console.error("Error al buscar grados:", error);
      res.status(500).json({ error: 'Error al buscar grados', detalle: error.message });
    }
  },

  // ✅ Crear nuevo grado
  async crear(req, res) {
    try {
      const nuevo = await Grado.create(req.body);
      res.status(201).json(nuevo);
    } catch (error) {
      console.error("Error al crear grado:", error);
      res.status(400).json({ error: 'Error al crear grado', detalle: error.message });
    }
  },

  // ✅ Actualizar grado
  async actualizar(req, res) {
    const { id } = req.params;
    try {
      const [actualizado] = await Grado.update(req.body, {
        where: { id_grado: id }
      });

      if (actualizado === 0) {
        return res.status(404).json({ error: 'Grado no encontrado o sin cambios' });
      }

      res.json({ mensaje: 'Grado actualizado correctamente' });
    } catch (error) {
      console.error("Error al actualizar grado:", error);
      res.status(400).json({ error: 'Error al actualizar grado', detalle: error.message });
    }
  },

  // ✅ Eliminar grado
  async eliminar(req, res) {
    const { id } = req.params;
    try {
      const eliminado = await Grado.destroy({
        where: { id_grado: id }
      });

      if (eliminado === 0) {
        return res.status(404).json({ error: 'Grado no encontrado' });
      }

      res.json({ mensaje: 'Grado eliminado correctamente' });
    } catch (error) {
      console.error("Error al eliminar grado:", error);
      res.status(500).json({ error: 'Error al eliminar grado', detalle: error.message });
    }
  },

  // ✅ Contar estudiantes en un grado
  // ✅ Contar estudiantes en un grado
async contarEstudiantes(req, res) {
  const { id } = req.params; // 👈 antes: req.query.id_grado

  if (!id) return res.status(400).json({ error: 'Debe enviar id del grado' });

  try {
    const total = await EstudianteGrado.count({ where: { id_grado: id } });
    res.json({ id_grado: id, total_estudiantes: total });
  } catch (error) {
    console.error("Error al contar estudiantes:", error);
    res.status(500).json({ error: 'Error al contar estudiantes', detalle: error.message });
  }
},


  // ✅ Ver funcionarios asignados a un grado
  async funcionariosAsignados(req, res) {
    const { id } = req.params;

    try {
      const funcionarios = await FuncionarioGrado.findAll({
        where: { id_grado: id },
        include: ['funcionario']
      });

      res.json(funcionarios);
    } catch (error) {
      console.error("Error al listar funcionarios asignados:", error);
      res.status(500).json({ error: 'Error al obtener funcionarios', detalle: error.message });
    }
  }

};

module.exports = gradoController;
