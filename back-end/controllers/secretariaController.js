const db = require('../models');
const Secretaria = db.Secretaria;
const Usuario = db.Usuario;
const { Op } = require('sequelize');

const secretariaController = {
  // ✅ Obtener todas las secretarias
  async obtenerTodas(req, res) {
    try {
      const lista = await Secretaria.findAll({
        include: [{ model: Usuario }]
      });
      res.json(lista);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener las secretarias' });
    }
  },

  // ✅ Obtener una secretaria por ID
  async obtenerPorId(req, res) {
    const id = req.params.id;
    try {
      const secretaria = await Secretaria.findByPk(id, {
        include: [{ model: Usuario }]
      });
      if (secretaria) {
        res.json(secretaria);
      } else {
        res.status(404).json({ error: 'Secretaria no encontrada' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al buscar secretaria' });
    }
  },

  // ✅ Crear una nueva secretaria
  async crear(req, res) {
    try {
      const nueva = await Secretaria.create(req.body);
      res.status(201).json(nueva);
    } catch (error) {
      res.status(400).json({ error: 'Error al crear la secretaria', detalle: error.message });
    }
  },

  // ✅ Actualizar datos de una secretaria
  async actualizar(req, res) {
    const id = req.params.id;
    try {
      const [filas] = await Secretaria.update(req.body, {
        where: { id_secretaria: id }
      });

      if (filas === 0) {
        res.status(404).json({ error: 'Secretaria no encontrada o sin cambios' });
      } else {
        res.json({ mensaje: 'Secretaria actualizada correctamente' });
      }
    } catch (error) {
      res.status(400).json({ error: 'Error al actualizar la secretaria' });
    }
  },

  // ✅ Eliminar una secretaria
  async eliminar(req, res) {
    const id = req.params.id;
    try {
      const filas = await Secretaria.destroy({
        where: { id_secretaria: id }
      });

      if (filas === 0) {
        res.status(404).json({ error: 'Secretaria no encontrada' });
      } else {
        res.json({ mensaje: 'Secretaria eliminada correctamente' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar la secretaria' });
    }
  },

  // 🔍 Buscar secretaria por nombre
  async buscarPorNombre(req, res) {
    const { nombre } = req.query;
    try {
      const resultados = await Secretaria.findAll({
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
      res.status(500).json({ error: 'Error al buscar secretarias' });
    }
  }
};

module.exports = secretariaController;
