module.exports = (req, res, next) => {
  const usuario = req.usuario;
  console.log('🧪 Usuario autenticado:', req.usuario);


  // Asegúrate de que `req.usuario` tenga cargado el tipo de usuario
  if (!usuario || !usuario.id_tipo_usuario) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  // Solo permiten rol Coordinador (4), Rector (7), Administrativo (6)
  const rolesPermitidos = [4, 7, 6];
  if (!rolesPermitidos.includes(usuario.id_tipo_usuario)) {
    return res.status(403).json({ error: 'Acceso denegado: rol no autorizado' });
  }

  next(); // Permite continuar si tiene el rol adecuado
};
