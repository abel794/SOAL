const db = require('../../models');
const { Pqr, Acudiente, Estudiante, TipoPqr, EstadoPqr, EstudianteAcudiente, Persona } = db;
const { Op } = require('sequelize');

const pqrController = {
  // ✅ Crear un nuevo PQR
// ✅ Obtener todos los PQR con detalles (incluye nombre y apellido de acudiente y estudiante)
async listarTodos(req, res) {
  try {
    console.log('📥 [PQR] Petición recibida para listar todos los PQRs');

    const lista = await Pqr.findAll({
      include: [
        { 
          model: Acudiente, 
          as: 'acudiente',
          include: [
            { model: Persona, as: 'persona', attributes: ['nombre', 'apellido'] }
          ]
        },
        { 
          model: Estudiante, 
          as: 'estudiante',
          include: [
            { model: Persona, as: 'persona', attributes: ['nombre', 'apellido'] }
          ]
        },
        { model: TipoPqr, as: 'tipo', attributes: ['nombre'] },
        { model: EstadoPqr, as: 'estado', attributes: ['nombre'] }
      ],
      order: [['fecha', 'DESC']]
    });

    console.log(`✅ [PQR] Se encontraron ${lista.length} registros`);
    lista.forEach((pqr, index) => {
      console.log(
        `#${index + 1} → ID: ${pqr.id_pqr}, Acudiente: ${pqr.acudiente?.persona?.nombre || '—'} ${pqr.acudiente?.persona?.apellido || ''}, Estado: ${pqr.estado?.nombre}`
      );
    });

    res.json(lista);

  } catch (error) {
    console.error('❌ [PQR] Error al listar PQRs:', error);
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
