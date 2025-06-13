const express = require('express');
const router = express.Router();
const db = require('../db');

// Obtener todas las observaciones
router.get('/', (req, res) => {
  const sql = `
    SELECT o.id_observacion, o.descripcion, o.fecha_observacion,
           u.nombre AS usuario, e.nombre AS estudiante, c.nombre AS categoria
    FROM observacion o
    JOIN usuario u ON o.id_usuario = u.id
    JOIN estudiante e ON o.id_estudiante = e.id
    JOIN categoriaobservacion c ON o.id_categoria = c.id
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al consultar observaciones' });
    res.json(results);
  });
});

// Crear nueva observación
router.post('/', (req, res) => {
  const { id_usuario, id_estudiante, id_categoria, descripcion } = req.body;

  if (!id_usuario || !id_estudiante || !id_categoria || !descripcion) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }

  const sql = `
    INSERT INTO observacion (id_usuario, id_estudiante, id_categoria, descripcion)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [id_usuario, id_estudiante, id_categoria, descripcion], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al registrar observación' });
    res.status(201).json({ id_observacion: result.insertId });
  });
});

module.exports = router;
