// middlewares/checkRole.js
module.exports = (rolesPermitidos) => {
  return (req, res, next) => {
    try {
      const usuario = req.usuario; // viene del verificarToken.js
      if (!usuario) {
        return res.status(401).json({ mensaje: "No autenticado" });
      }

      if (!rolesPermitidos.includes(usuario.rol)) {
        return res.status(403).json({ mensaje: "Acceso denegado" });
      }

      next();
    } catch (error) {
      return res.status(500).json({ mensaje: "Error en autorización", error });
    }
  };
};
