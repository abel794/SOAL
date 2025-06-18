const express = require('express');
const routerCitas = express.Router(); // ✅ nombre correcto
const db = require('../db');

// GET /api/citas/total
routerCitas.get('/total', async (req, res) => {
  try {
    const [resultado] = await db.promise().query(`SELECT COUNT(*) AS total_citas FROM cita`);
    res.json({ total_citas: resultado[0].total_citas });
  } catch (error) {
    console.error('Error al contar citas:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

module.exports = routerCitas;
