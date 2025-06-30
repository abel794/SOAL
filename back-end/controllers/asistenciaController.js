// Importamos el objeto de base de datos que contiene todos los modelos
const db = require('../models');

// Obtenemos específicamente el modelo de Asistencia desde db
const Asistencia = db.Asistencia;

// Importamos operadores de Sequelize (como Op.like, Op.eq, etc.)
const { Op } = require('sequelize');

// Definimos el objeto controlador con funciones para cada acción
const asistenciaController = {

  // 📌 Registrar una nueva asistencia
  async registrar(req, res) {
    try {
      // Crea una nueva fila en la tabla asistencia con los datos del body
      const nueva = await Asistencia.create(req.body);

      // Devuelve un mensaje de éxito y los datos creados
      res.status(201).json({ mensaje: 'Asistencia registrada', asistencia: nueva });
    } catch (error) {
      console.error(error); // Imprime error en consola para debug
      res.status(400).json({
        error: 'Error al registrar asistencia',
        detalle: error.message
      });
    }
  },

  // 📄 Obtener todas las asistencias registradas
  async obtenerTodas(req, res) {
    try {
      // Busca todas las asistencias sin filtro
      const lista = await Asistencia.findAll();
      res.json(lista); // Devuelve lista completa
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener asistencias' });
    }
  },

  // 🔍 Buscar asistencias por ID del estudiante
  async porEstudiante(req, res) {
    const id = parseInt(req.params.id); // Convierte a número

    // Validación de entrada
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID de estudiante inválido' });
    }

    try {
      // Busca asistencias relacionadas con el estudiante
      const asistencias = await Asistencia.findAll({
        where: { id_estudiante: id }
      });
      res.json(asistencias);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al buscar asistencias del estudiante' });
    }
  },

  // 🔍 Buscar asistencias por ID del funcionario (profesor)
  async porProfesor(req, res) {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID de profesor inválido' });
    }

    try {
      // ⚠️ Asegúrate de que en tu modelo la columna sea id_funcionario, no id_profesor
      const asistencias = await Asistencia.findAll({
        where: { id_funcionario: id }
      });
      res.json(asistencias);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al buscar asistencias del profesor' });
    }
  },

  // 📅 Buscar asistencias por fecha exacta
  async porFecha(req, res) {
    const { fecha } = req.params;

    // Validación de formato YYYY-MM-DD
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
      return res.status(400).json({ error: 'Formato de fecha inválido. Usa YYYY-MM-DD' });
    }

    try {
      // Busca asistencias de esa fecha
      const asistencias = await Asistencia.findAll({
        where: { fecha }
      });
      res.json(asistencias);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al buscar asistencias por fecha' });
    }
  },

  // 🔢 Contar asistencias por estado (ej. Presente, Ausente...)
  async contarPorEstado(req, res) {
  const { estado } = req.params;

  try {
    // Asegúrate de convertir a número si es necesario
    const total = await Asistencia.count({
      where: { id_estado_asistencia: estado }
    });

    res.json({
      total,
      estado,
      mensaje: total === 0
        ? 'No se encontraron asistencias con ese estado'
        : 'Asistencias contadas correctamente'
    });
  } catch (error) {
    console.error('Error al contar asistencias por estado:', error);
    res.status(500).json({ error: 'Error al contar asistencias por estado' });
  }
},


  // 🔍 Buscar asistencias combinando estado + fecha
  async porEstadoYFecha(req, res) {
    const { estado, fecha } = req.query;

    // Validación: que existan ambos campos
    if (!estado || !fecha) {
      return res.status(400).json({ error: 'Debes proporcionar estado y fecha como parámetros' });
    }

    try {
      // Busca asistencias que coincidan con estado y fecha
      const asistencias = await Asistencia.findAll({
        where: {
        id_estado_asistencia: estado,   // ✅ correcto
        fecha: fecha
      }
      });
      res.json(asistencias);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al filtrar asistencias por estado y fecha' });
    }
  }

};

// Exportamos el controlador para usar en las rutas
module.exports = asistenciaController;

