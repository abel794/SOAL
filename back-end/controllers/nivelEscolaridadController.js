const db = require('../models');
const NivelEscolaridad = db.NivelEscolaridad;
const Funcionario = db.Funcionario;
const { Op } = require('sequelize');

const controller = {

  // ✅ Listar todos los niveles
  async listar(req, res) {
    try {
      const niveles = await NivelEscolaridad.findAll({
        include: {
          model: Funcionario,
          as: 'funcionarios',
          attributes: ['id_funcionario', 'cargo']
        },
        order: [['nombre', 'ASC']]
      });
      res.json(niveles);
    } catch (error) {
      console.error('Error al listar niveles:', error);
      res.status(500).json({ error: 'Error al obtener niveles', detalle: error.message });
    }
  },

  // ✅ Crear nuevo nivel
  async crear(req, res) {
    try {
      const nuevo = await NivelEscolaridad.create(req.body);
      res.status(201).json(nuevo);
    } catch (error) {
      console.error('Error al crear nivel:', error);
      res.status(400).json({ error: 'No se pudo crear el nivel', detalle: error.message });
    }
  },

  // ✅ Actualizar nivel
  async actualizar(req, res) {
    const id = req.params.id;
    try {
      const [modificado] = await NivelEscolaridad.update(req.body, {
        where: { id_escolaridad: id }
      });
      if (modificado === 0) {
        res.status(404).json({ error: 'Nivel no encontrado o sin cambios' });
      } else {
        res.json({ mensaje: 'Nivel actualizado correctamente' });
      }
    } catch (error) {
      console.error('Error al actualizar nivel:', error);
      res.status(500).json({ error: 'No se pudo actualizar el nivel', detalle: error.message });
    }
  },

  // ✅ Eliminar nivel
  async eliminar(req, res) {
    const id = req.params.id;
    try {
      const eliminado = await NivelEscolaridad.destroy({
        where: { id_escolaridad: id }
      });
      if (eliminado === 0) {
        res.status(404).json({ error: 'Nivel no encontrado' });
      } else {
        res.json({ mensaje: 'Nivel eliminado correctamente' });
      }
    } catch (error) {
      console.error('Error al eliminar nivel:', error);
      res.status(500).json({ error: 'No se pudo eliminar el nivel', detalle: error.message });
    }
  },

  // 🔍 Buscar por nombre
  async buscarPorNombre(req, res) {
    const { nombre } = req.query;
    if (!nombre) {
      return res.status(400).json({ error: 'El parámetro "nombre" es obligatorio' });
    }
    try {
      const resultados = await NivelEscolaridad.findAll({
        where: {
          nombre: { [Op.like]: `%${nombre}%` }
        }
      });
      res.json(resultados);
    } catch (error) {
      console.error('Error al buscar por nombre:', error);
      res.status(500).json({ error: 'Error en la búsqueda', detalle: error.message });
    }
  },

  // 📊 Contar funcionarios por nivel
  async contarFuncionarios(req, res) {
    try {
      const resultados = await NivelEscolaridad.findAll({
        attributes: [
          'nombre',
          [db.sequelize.fn('COUNT', db.sequelize.col('funcionarios.id_funcionario')), 'total']
        ],
        include: {
          model: Funcionario,
          as: 'funcionarios',
          attributes: []
        },
        group: ['NivelEscolaridad.id_escolaridad'],
        order: [['nombre', 'ASC']]
      });
      res.json(resultados);
    } catch (error) {
      console.error('Error al contar funcionarios:', error);
      res.status(500).json({ error: 'Error al contar funcionarios por nivel', detalle: error.message });
    }
  }
};

module.exports = controller;
