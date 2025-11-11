// 📂 middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config();
const db = require('../models');
const { Funcionario, Usuario, Estudiante, Acudiente, Persona } = db;

// 🧩 Mapeo de tipos a rol legible
const rolesMap = {
  1: 'Estudiante',
  2: 'Acudiente',
  3: 'Profesor',
  4: 'Coordinador',
  5: 'Secretaria',
  6: 'Administrativo',
  7: 'Rector',
  8: 'Orientador',
};

async function verificarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ mensaje: '❌ Acceso denegado. No hay token.' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ mensaje: '❌ Token no encontrado.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //console.log('🧩 Token generado:', token);

    // Rol legible a partir de id_tipo_usuario (si existe)
    decoded.rol = rolesMap[decoded.id_tipo_usuario] || decoded.rol || 'Desconocido';

    if (!decoded.id_usuario) {
      return res.status(401).json({ mensaje: '⚠️ Token válido, pero sin id_usuario.' });
    }

    // Buscar en paralelo si es funcionario / estudiante / acudiente
    const [funcionario, estudiante, acudiente] = await Promise.all([
      Funcionario.findOne({
        where: { id_usuario: decoded.id_usuario },
        include: [{ model: Usuario, as: 'usuario', attributes: ['username', 'id_tipo_usuario'] }],
      }).catch(() => null),
      Estudiante.findOne({
        where: { id_usuario: decoded.id_usuario },
        include: [{ model: Persona, as: 'persona', attributes: ['nombre', 'apellido', 'correo', 'numero_documento'] }],
      }).catch(() => null),
      Acudiente.findOne({
        where: { id_usuario: decoded.id_usuario },
        include: [{ model: Persona, as: 'persona', attributes: ['nombre', 'apellido', 'correo', 'numero_documento'] }],
      }).catch(() => null),
    ]);

    // 🧠 Adjuntar información encontrada al payload
    if (funcionario) {
      decoded.id_funcionario = funcionario.id_funcionario;
      decoded.username = funcionario.usuario?.username || decoded.username;
      decoded.cargo = funcionario.cargo || null;
      if (funcionario.usuario?.id_tipo_usuario) {
        decoded.rol = rolesMap[funcionario.usuario.id_tipo_usuario] || decoded.rol;
      }
    }

    if (estudiante) {
      decoded.id_estudiante = estudiante.id_estudiante;
      decoded.persona_estudiante = {
        nombre: estudiante.persona?.nombre || null,
        apellido: estudiante.persona?.apellido || null,
        correo: estudiante.persona?.correo || null,
        numero_documento: estudiante.persona?.numero_documento || null,
      };
      decoded.rol = decoded.rol === 'Desconocido' ? 'Estudiante' : decoded.rol;
    }

    if (acudiente) {
      decoded.id_acudiente = acudiente.id_acudiente;
      decoded.persona_acudiente = {
        nombre: acudiente.persona?.nombre || null,
        apellido: acudiente.persona?.apellido || null,
        correo: acudiente.persona?.correo || null,
        numero_documento: acudiente.persona?.numero_documento || null,
      };
      decoded.rol = decoded.rol === 'Desconocido' ? 'Acudiente' : decoded.rol;
    }

// 🔑 Dejar id_usuario y rol siempre presentes en req.user
req.user = {
  id_usuario: decoded.id_usuario,
  rol: decoded.rol,
  id_funcionario: decoded.id_funcionario ?? null,
  id_estudiante: decoded.id_estudiante ?? null,
  id_acudiente: decoded.id_acudiente ?? null,
  username: decoded.username ?? null,
  persona_estudiante: decoded.persona_estudiante ?? null,
  persona_acudiente: decoded.persona_acudiente ?? null,
  raw: decoded,
};

// 🧩 Compatibilidad con código antiguo
req.usuario = req.user;
/*
    console.log('🔒 [Auth] Usuario autenticado:', {
      id_usuario: req.user.id_usuario,
      id_funcionario: req.user.id_funcionario,
      id_estudiante: req.user.id_estudiante,
      id_acudiente: req.user.id_acudiente,
      username: req.user.username,
      rol: req.user.rol,
    });


    console.log('🔒 [Auth] Usuario autenticado:', {
      id_usuario: req.user.id_usuario,
      id_funcionario: req.user.id_funcionario,
      id_estudiante: req.user.id_estudiante,
      id_acudiente: req.user.id_acudiente,
      username: req.user.username,
      rol: req.user.rol,
    });*/

    next();
  } catch (error) {
    console.error('❌ [Auth] Error al verificar token:', error.message);
    return res.status(403).json({ mensaje: '❌ Token inválido o expirado.' });
  }
}

// 🧰 Middleware para verificar roles permitidos
function verificarRol(rolesPermitidos = []) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ mensaje: '❌ No autenticado.' });
    if (!Array.isArray(rolesPermitidos) || rolesPermitidos.length === 0) return next();

    const userRole = (req.user.rol || '').toString();
    const permitido = rolesPermitidos.some(r => r.toString() === userRole);

    if (!permitido) {
      return res.status(403).json({ mensaje: '❌ No tienes permisos para acceder a esta ruta.' });
    }

    next();
  };
}

module.exports = { verificarToken, verificarRol };
