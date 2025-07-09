// middlewares/autorizacionConfiguracion.js

module.exports = function (req, res, next) {
  const usuario = req.usuario; // viene del middleware de autenticación (JWT)

  // Solo permitir acceso a Coordinador, Rector y Administrativo
  const rolesPermitidos = [4, 6, 7]; // id_tipo_usuario permitidos

  if (!rolesPermitidos.includes(usuario.id_tipo_usuario)) {
    return res.status(403).json({ error: '⛔ Acceso denegado: solo personal autorizado puede modificar la configuración del sistema.' });
  }

  next();
};
