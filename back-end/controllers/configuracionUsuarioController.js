// controllers/configuracionUsuarioController.js
const { Usuario, Persona } = require("../models");
const bcrypt = require("bcryptjs");

const obtenerConfiguracion = async (req, res) => {
  const { id_usuario } = req.params;
  try {
    const usuario = await Usuario.findByPk(id_usuario, {
      include: [
        {
          model: Persona,
          as: "persona",
          attributes: [
            "numero_documento",
            "nombre",
            "apellido",
            "correo",
            "telefono",
            "direccion",
            "ciudad_residencia",
          ],
        },
      ],
    });

    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    return res.json(usuario);
  } catch (error) {
    console.error("Error al obtener configuración:", error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

const actualizarConfiguracion = async (req, res) => {
  const { id_usuario } = req.params;
  const { correo, telefono, direccion, ciudad_residencia, contrasenaActual, contrasenaNueva } = req.body;

  try {
    const usuario = await Usuario.findByPk(id_usuario);
    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    // ✅ Si el usuario quiere cambiar la contraseña
    if (contrasenaNueva) {
      if (!contrasenaActual) {
        return res.status(400).json({ mensaje: "Debe ingresar la contraseña actual" });
      }

      const esValida = await bcrypt.compare(contrasenaActual, usuario.contrasena);
      if (!esValida) {
        return res.status(401).json({ mensaje: "La contraseña actual no es correcta" });
      }

      const hashedPassword = await bcrypt.hash(contrasenaNueva, 10);
      usuario.contrasena = hashedPassword;
      await usuario.save();
    }

    // ✅ Actualizar datos de Persona
    const persona = await Persona.findOne({
      where: { numero_documento: usuario.numero_documento },
    });

    if (persona) {
      if (correo) persona.correo = correo;
      if (telefono) persona.telefono = telefono;
      if (direccion) persona.direccion = direccion;
      if (ciudad_residencia) persona.ciudad_residencia = ciudad_residencia;

      await persona.save();
    }

    return res.json({
      mensaje: "Configuración actualizada correctamente",
      usuario: { id_usuario: usuario.id_usuario, username: usuario.username },
      persona,
    });
  } catch (error) {
    console.error("Error al actualizar configuración:", error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

module.exports = { obtenerConfiguracion, actualizarConfiguracion };
