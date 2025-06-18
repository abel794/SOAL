const express = require('express');
const routerCriterios = express.Router(); // ✅ Nombre correcto del router
const db = require('../db');

// GET /api/observaciones/criticos
routerCriterios.get('/observaciones/criticos', async (req, res) => {
  try {
    const [resultado] = await db.promise().query(`
      SELECT COUNT(*) AS casos_criticos 
      FROM observacion 
      WHERE id_categoria = (
        SELECT id_categoria FROM categoriaobservacion WHERE nombre_categoria = 'Disciplinaria'
      );
    `);
    res.json({ casos_criticos: resultado[0].casos_criticos });
  } catch (error) {
    console.error('Error al contar casos críticos:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// GET /api/observaciones/total
routerCriterios.get('/observaciones/total', async (req, res) => {
  try {
    const [resultado] = await db.promise().query(`
      SELECT COUNT(*) AS total_observaciones FROM observacion
    `);
    res.json({ total_observaciones: resultado[0].total_observaciones });
  } catch (error) {
    console.error('Error al contar observaciones:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

module.exports = routerCriterios;

