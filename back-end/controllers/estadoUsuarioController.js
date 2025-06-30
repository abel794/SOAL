const { EstadoUsuario } = require('../models'); // Ajusta la ruta según tu estructura
const { Op } = require('sequelize');

module.exports = {
  // ✅ 1. Listar todos los estados (activo, inactivo, suspendido, etc.)
  async listarTodos(req, res) {
    try {
      const estados = await EstadoUsuario.findAll();
      res.json(estados);
    } catch (error) {
      console.error('Error al listar estados:', error);
      res.status(500).json({ error: 'Error al listar los estados de usuario' });
    }
  },

  // ✅ 2. Buscar estados por nombre (para filtros o autocompletados)
  async buscarPorNombre(req, res) {
    try {
      const { nombre } = req.query;

      if (!nombre) {
        return res.status(400).json({ error: 'Debe proporcionar un nombre para buscar' });
      }

      const resultados = await EstadoUsuario.findAll({
        where: {
          nombre: {
            [Op.like]: `%${nombre}%` // puedes usar Op.iLike si tu DB es PostgreSQL
          }
        }
      });

      res.json(resultados);
    } catch (error) {
      console.error('Error al buscar estados por nombre:', error);
      res.status(500).json({ error: 'Error al buscar estados' });
    }
  },

  // ✅ 3. Contar cuántos estados hay
  async contarEstados(req, res) {
    try {
      const total = await EstadoUsuario.count();
      res.json({ total });
    } catch (error) {
      console.error('Error al contar estados:', error);
      res.status(500).json({ error: 'Error al contar los estados' });
    }
  },

  // ✅ 4. Crear nuevos estados
  async crearEstado(req, res) {
    try {
      const { nombre } = req.body;

      if (!nombre) {
        return res.status(400).json({ error: 'El nombre es obligatorio' });
      }

      const nuevoEstado = await EstadoUsuario.create({ nombre });
      res.status(201).json(nuevoEstado);
    } catch (error) {
      console.error('Error al crear estado:', error);
      res.status(500).json({ error: 'Error al crear el estado' });
    }
  },

  // ✅ 5. Actualizar estado existente
  async actualizarEstado(req, res) {
    try {
      const { id } = req.params;
      const { nombre } = req.body;

      const estado = await EstadoUsuario.findByPk(id);
      if (!estado) {
        return res.status(404).json({ error: 'Estado no encontrado' });
      }

      if (!nombre) {
        return res.status(400).json({ error: 'El nombre es obligatorio' });
      }

      estado.nombre = nombre;
      await estado.save();

      res.json(estado);
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      res.status(500).json({ error: 'Error al actualizar el estado' });
    }
  }
};

