const db = require('../models');
const Asistencia = db.Asistencia;
const { Op } = require('sequelize');

const asistenciaController = {
  // 📌 Registrar nueva asistencia
  async registrar(req, res) {
    try {
      const nueva = await Asistencia.create(req.body);
      res.status(201).json({ mensaje: 'Asistencia registrada', asistencia: nueva });
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: 'Error al registrar asistencia', detalle: error.message });
    }
  },

  // 📄 Obtener todas las asistencias
  async obtenerTodas(req, res) {
    try {
      const lista = await Asistencia.findAll();
      res.json(lista);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener asistencias' });
    }
  },

  // 🔍 Buscar por estudiante
  async porEstudiante(req, res) {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'ID de estudiante inválido' });

    try {
      const asistencias = await Asistencia.findAll({ where: { id_estudiante: id } });
      res.json(asistencias);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al buscar asistencias del estudiante' });
    }
  },

  // 🔍 Buscar por profesor
  async porProfesor(req, res) {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'ID de profesor inválido' });

    try {
      const asistencias = await Asistencia.findAll({ where: { id_profesor: id } });
      res.json(asistencias);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al buscar asistencias del profesor' });
    }
  },

  // 📅 Buscar por fecha exacta con validación
  async porFecha(req, res) {
    const { fecha } = req.params;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
      return res.status(400).json({ error: 'Formato de fecha inválido. Usa YYYY-MM-DD' });
    }

    try {
      const asistencias = await Asistencia.findAll({ where: { fecha } });
      res.json(asistencias);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al buscar asistencias por fecha' });
    }
  },

  // 🔢 Contar asistencias por estado
  async contarPorEstado(req, res) {
    const { estado } = req.params;
    try {
      const total = await Asistencia.count({ where: { estado } });
      res.json({
        total,
        estado,
        mensaje: total === 0 ? 'No se encontraron asistencias con ese estado' : 'Asistencias contadas correctamente'
      });
    } catch (error) {
      console.error('Error al contar asistencias por estado:', error);
      res.status(500).json({ error: 'Error al contar asistencias por estado' });
    }
  },

  // 🔍 Buscar por estado y fecha combinados
  async porEstadoYFecha(req, res) {
    const { estado, fecha } = req.query;

    if (!estado || !fecha) {
      return res.status(400).json({ error: 'Debes proporcionar estado y fecha como parámetros' });
    }

    try {
      const asistencias = await Asistencia.findAll({
        where: { estado, fecha }
      });
      res.json(asistencias);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al filtrar asistencias por estado y fecha' });
    }
  }
};

module.exports = asistenciaController;

