// back-end/middlewares/verificarToken.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token no proporcionado o mal formado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'miclave123');

    // Guardamos el id_funcionario y username en req.user
    req.user = {
      id_funcionario: decoded.id_funcionario,
      username: decoded.username
    };
    console.log('Headers recibidos:', req.headers);
    console.log('Authorization header:', req.headers['authorization']);


    next();
  } catch (error) {
    console.error('Error al verificar token:', error);
    return res.status(401).json({ error: 'Token no válido' });
  }
};
