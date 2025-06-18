const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/estudiante/nombre/:nombre
router.get('/nombre/:nombre', async (req, res) => {
  const { nombre } = req.params;
  try {
    const [resultado] = await db.promise().query(`
      SELECT 
        e.nombre AS nombre_estudiante,
        g.nombre_grado,
        o.descripcion AS observacion
      FROM estudiante e
      JOIN estudiantegrado eg ON e.id_estudiante = eg.id_estudiante
      JOIN grado g ON eg.id_grado = g.id_grado
      LEFT JOIN observacion o ON e.id_estudiante = o.id_estudiante
      WHERE e.nombre = ?;
    `, [nombre]);

    res.json(resultado);
  } catch (error) {
    console.error('Error al buscar por nombre:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// GET /api/estudiante/todos
router.get('/todos', async (req, res) => {
  try {
    const [resultado] = await db.promise().query(`
      SELECT 
        e.nombre AS nombre_estudiante,
        e.apellido,
        e.numero_documento,
        g.nombre_grado,
        TIMESTAMPDIFF(YEAR, e.fecha_nacimiento, CURDATE()) AS edad,
        o.descripcion AS observacion
      FROM estudiante e
      JOIN estudiantegrado eg ON e.id_estudiante = eg.id_estudiante
      JOIN grado g ON eg.id_grado = g.id_grado
      LEFT JOIN observacion o ON e.id_estudiante = o.id_estudiante
      ORDER BY e.nombre;
    `);

    res.json(resultado);
  } catch (error) {
    console.error('Error al obtener todos los estudiantes:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});



// GET /api/estudiante/documento/:documento
router.get('/documento/:documento', async (req, res) => {
  const { documento } = req.params;

  try {
    const [resultado] = await db.promise().query(
      'SELECT * FROM estudiante WHERE numero_documento = ?', 
      [documento]
    );

    if (resultado.length === 0) {
      return res.status(404).json({ mensaje: 'Estudiante no encontrado' });
    }

    res.json(resultado[0]);
  } catch (error) {
    console.error('Error al buscar estudiante por documento:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// GET /api/estudiante/count/grado/:nombreGrado
router.get('/count/grado/:nombreGrado', async (req, res) => {
  const { nombreGrado } = req.params;

  try {
    const [resultado] = await db.promise().query(`
      SELECT COUNT(*) AS total_estudiantes
      FROM estudiantegrado eg
      JOIN grado g ON eg.id_grado = g.id_grado
      JOIN estudiante e ON eg.id_estudiante = e.id_estudiante
      WHERE g.nombre_grado = ?
    `, [nombreGrado]);

    res.json({ grado: nombreGrado, total_estudiantes: resultado[0].total_estudiantes });
  } catch (error) {
    console.error('Error al contar estudiantes por grado:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});






module.exports = router;

