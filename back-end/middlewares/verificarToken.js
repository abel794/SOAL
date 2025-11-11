// back/middlewares/verificarToken.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.warn('⚠️ JWT_SECRET no está definido en .env — configura una clave segura.');
}

module.exports = (req, res, next) => {
  // soporta tanto 'authorization' como 'Authorization'
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader || typeof authHeader !== 'string') {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  // Esperamos: "Bearer <token>" (no sensible a mayúsculas en la palabra Bearer)
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || !/^Bearer$/i.test(parts[0])) {
    return res.status(401).json({ error: 'Header Authorization mal formado. Debe ser: Bearer <token>' });
  }

  const token = parts[1];

  try {
    const usuario = jwt.verify(token, JWT_SECRET);
    req.usuario = usuario; 
    next();
  } catch (error) {
    console.error('❌ verificarToken: token inválido/expirado ->', error.message);
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};
