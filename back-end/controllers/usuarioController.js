const db = require('../models');
const Usuario = db.Usuario;
const { Op } = require('sequelize');

const usuarioController = {
  // ✅ Obtener todos los usuarios
  async obtenerTodos(req, res) {
    try {
      const usuarios = await Usuario.findAll();
      res.json(usuarios);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
  },

  // ✅ Obtener usuario por ID
  async obtenerPorId(req, res) {
    const id = req.params.id;
    try {
      const usuario = await Usuario.findByPk(id);
      if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
      res.json(usuario);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el usuario' });
    }
  },

  // ✅ Crear nuevo usuario
  async crear(req, res) {
    try {
      const nuevo = await Usuario.create(req.body);
      res.status(201).json(nuevo);
    } catch (error) {
      console.error("el error es: ", error);
      res.status(400).json({ error: 'Error al crear el usuario', detalle: error.message });
    }
  },

  // ✅ Actualizar usuario
  async actualizar(req, res) {
    const id = req.params.id;
    try {
      const [filas] = await Usuario.update(req.body, {
        where: { id_usuario: id }
      });

      if (filas === 0) {
        res.status(404).json({ error: 'Usuario no encontrado o sin cambios' });
      } else {
        res.json({ mensaje: 'Usuario actualizado correctamente' });
      }
    } catch (error) {
      res.status(400).json({ error: 'Error al actualizar el usuario' });
    }
  },

  // ✅ Eliminar usuario
  async eliminar(req, res) {
    const id = req.params.id;
    try {
      const filas = await Usuario.destroy({ where: { id_usuario: id } });

      if (filas === 0) {
        res.status(404).json({ error: 'Usuario no encontrado' });
      } else {
        res.json({ mensaje: 'Usuario eliminado correctamente' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar el usuario' });
    }
  },

  // 🔍 Buscar usuario por nombre_usuario
  async buscar(req, res) {
    const { nombre_usuario } = req.query;
    try {
      const usuarios = await Usuario.findAll({
        where: {
          username: { [Op.like]: `%${nombre_usuario}%` }
        }
      });

      if (usuarios.length === 0) {
        res.status(404).json({ mensaje: 'No se encontraron coincidencias' });
      } else {
        res.json(usuarios);
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al buscar usuarios' });
    }
  },

  // ✅ Activar por ID (id_estado_usuario = 1)
  async activar(req, res) {
    const id = req.params.id;
    try {
      const [filas] = await Usuario.update(
        { id_estado_usuario: 1 },
        { where: { id_usuario: id } }
      );

      if (filas === 0) {
        res.status(404).json({ error: 'Usuario no encontrado o ya activo' });
      } else {
        res.json({ mensaje: 'Usuario activado' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al activar el usuario' });
    }
  },

  // ✅ Inactivar por ID (id_estado_usuario = 2)
  async inactivar(req, res) {
    const id = req.params.id;
    try {
      const [filas] = await Usuario.update(
        { id_estado_usuario: 2 },
        { where: { id_usuario: id } }
      );

      if (filas === 0) {
        res.status(404).json({ error: 'Usuario no encontrado o ya inactivo' });
      } else {
        res.json({ mensaje: 'Usuario inactivado' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al inactivar el usuario' });
    }
  },

  // ✅ Activar todos
  async activarTodos(req, res) {
    try {
      await Usuario.update(
        { id_estado_usuario: 1 },
        { where: {} }
      );
      res.json({ mensaje: 'Todos los usuarios fueron activados' });
    } catch (error) {
      res.status(500).json({ error: 'Error al activar todos los usuarios' });
    }
  },

  // ✅ Inactivar todos
  async inactivarTodos(req, res) {
    try {
      await Usuario.update(
        { id_estado_usuario: 2 },
        { where: {} }
      );
      res.json({ mensaje: 'Todos los usuarios fueron inactivados' });
    } catch (error) {
      res.status(500).json({ error: 'Error al inactivar todos los usuarios' });
    }
  },

  // ✅ Alternar estado Activo/Inactivo
// controllers/usuarioController.js

// Método para alternar entre activo (1) e inactivo (2) un usuario por su ID
async toggleEstado(req, res) {
  // 1️⃣ Extraemos el parámetro `id` de la URL: /api/usuarios/:id/toggle-estado
  const id = req.params.id;

  try {
    // 2️⃣ Buscamos al usuario en la base de datos por su PK
    const usuario = await Usuario.findByPk(id);

    // 3️⃣ Si no existe, devolvemos un 404 con mensaje de error
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // 4️⃣ Alternamos el valor de `id_estado_usuario`:
    //    - Si era 1 (activo), lo pasamos a 2 (inactivo)
    //    - Si era 2, lo pasamos a 1
    usuario.id_estado_usuario = usuario.id_estado_usuario === 1 ? 2 : 1;

    // 5️⃣ Guardamos los cambios en la base
    await usuario.save();

    // 6️⃣ Respondemos con un JSON que incluye:
    //    - Un mensaje de confirmación
    //    - El nuevo estado numérico
    res.json({
      mensaje: `Usuario ${usuario.id_estado_usuario === 1 ? 'activado' : 'inactivado'} correctamente`,
      estado: usuario.id_estado_usuario
    });
  } catch (error) {
    // 7️⃣ Si ocurre cualquier error interno, lo registramos y devolvemos un 500
    console.error('Error al alternar estado:', error);
    res.status(500).json({ error: 'Error al alternar el estado del usuario' });
  }
},



  // ✅ Activar o inactivar por número de documento
  async cambiarEstadoPorDocumento(req, res) {
    const { numero_documento } = req.params;
    const { id_estado_usuario } = req.body;

    try {
      const usuario = await Usuario.findOne({ where: { numero_documento } });

      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado con ese documento' });
      }

      usuario.id_estado_usuario = id_estado_usuario;
      await usuario.save();

      res.json({ mensaje: `Estado actualizado a ${id_estado_usuario}` });
    } catch (error) {
      res.status(500).json({ error: 'Error al cambiar el estado del usuario' });
    }
  }
};

module.exports = usuarioController;

