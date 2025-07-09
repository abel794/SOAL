const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token no proporcionado o mal formado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const usuario = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = usuario; // ✅ Aquí se guarda en el request
    next();
  } catch (error) {
    return res.status(403).json({ error: '❌ Token inválido o expirado' });
  }
};
