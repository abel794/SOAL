const db = require('../models');
const { Pqr, Acudiente, Estudiante, TipoPqr, EstadoPqr } = db;
const { Op } = require('sequelize');

const pqrController = {
  // ✅ Crear un nuevo PQR
  async crear(req, res) {
    try {
      const nuevo = await Pqr.create(req.body);
      res.status(201).json({ mensaje: 'PQR creado correctamente', data: nuevo });
    } catch (error) {
      console.error('Error al crear PQR:', error);
      res.status(400).json({ error: 'Error al crear PQR', detalle: error.message });
    }
  },

  // ✅ Obtener todos los PQR con detalles
  async listarTodos(req, res) {
    try {
      const lista = await Pqr.findAll({
        include: [
          { model: Acudiente, as: 'acudiente' },
          { model: Estudiante, as: 'estudiante' },
          { model: TipoPqr, as: 'tipo' },
          { model: EstadoPqr, as: 'estado' }
        ],
        order: [['fecha', 'DESC']]
      });
      res.json(lista);
    } catch (error) {
      console.error('Error al listar PQRs:', error);
      res.status(500).json({ error: 'Error al listar PQRs' });
    }
  },

  // ✅ Obtener un PQR por ID
  async obtenerPorId(req, res) {
    try {
      const pqr = await Pqr.findByPk(req.params.id, {
        include: [
          { model: Acudiente, as: 'acudiente' },
          { model: Estudiante, as: 'estudiante' },
          { model: TipoPqr, as: 'tipo' },
          { model: EstadoPqr, as: 'estado' }
        ]
      });
      if (!pqr) return res.status(404).json({ error: 'PQR no encontrado' });
      res.json(pqr);
    } catch (error) {
      console.error('Error al obtener PQR:', error);
      res.status(500).json({ error: 'Error al obtener PQR' });
    }
  },

  // ✅ Actualizar estado del PQR
  async actualizarEstado(req, res) {
    const { id_estado_pqr } = req.body;
    try {
      const actualizado = await Pqr.update(
        { id_estado_pqr },
        { where: { id_pqr: req.params.id } }
      );
      if (actualizado[0] === 0) {
        return res.status(404).json({ error: 'PQR no encontrado o sin cambios' });
      }
      res.json({ mensaje: 'Estado actualizado correctamente' });
    } catch (error) {
      console.error('Error al actualizar estado del PQR:', error);
      res.status(400).json({ error: 'Error al actualizar estado del PQR' });
    }
  },

  // ✅ Eliminar un PQR
  async eliminar(req, res) {
    try {
      const eliminado = await Pqr.destroy({
        where: { id_pqr: req.params.id }
      });
      if (eliminado === 0) {
        return res.status(404).json({ error: 'PQR no encontrado' });
      }
      res.json({ mensaje: 'PQR eliminado correctamente' });
    } catch (error) {
      console.error('Error al eliminar PQR:', error);
      res.status(500).json({ error: 'Error al eliminar PQR' });
    }
  },

  // 📋 Listar PQRs por acudiente
  async listarPorAcudiente(req, res) {
    const id_acudiente = req.params.id;
    try {
      const pqrs = await Pqr.findAll({
        where: { id_acudiente },
        include: [
          { model: Estudiante, as: 'estudiante' },
          { model: TipoPqr, as: 'tipo' },
          { model: EstadoPqr, as: 'estado' }
        ]
      });
      res.json(pqrs);
    } catch (error) {
      console.error('Error al listar PQRs por acudiente:', error);
      res.status(500).json({ error: 'Error al listar por acudiente' });
    }
  },

  // 📋 Listar PQRs por estado
  async listarPorEstado(req, res) {
    const estado = req.params.id_estado;
    try {
      const pqrs = await Pqr.findAll({
        where: { id_estado_pqr: estado },
        include: [
          { model: Acudiente, as: 'acudiente' },
          { model: Estudiante, as: 'estudiante' },
          { model: TipoPqr, as: 'tipo' }
        ]
      });
      res.json(pqrs);
    } catch (error) {
      console.error('Error al filtrar por estado:', error);
      res.status(500).json({ error: 'Error al listar por estado' });
    }
  },

  // 📊 Contar PQRs por tipo (petición, queja, reclamo)
  async contarPorTipo(req, res) {
    try {
      const tipos = await TipoPqr.findAll();
      const resultado = {};

      for (const tipo of tipos) {
        const cantidad = await Pqr.count({ where: { id_tipo_pqr: tipo.id_tipo_pqr } });
        resultado[tipo.nombre] = cantidad;
      }

      res.json(resultado);
    } catch (error) {
      console.error('Error al contar PQRs por tipo:', error);
      res.status(500).json({ error: 'Error al contar por tipo' });
    }
  },

  // 📊 Contar PQRs por estado (pendiente, revisado, cerrado)
  async contarPorEstado(req, res) {
    try {
      const estados = await EstadoPqr.findAll();
      const resultado = {};

      for (const estado of estados) {
        const cantidad = await Pqr.count({ where: { id_estado_pqr: estado.id_estado_pqr } });
        resultado[estado.nombre] = cantidad;
      }

      res.json(resultado);
    } catch (error) {
      console.error('Error al contar PQRs por estado:', error);
      res.status(500).json({ error: 'Error al contar por estado' });
    }
  }
};

module.exports = pqrController;
