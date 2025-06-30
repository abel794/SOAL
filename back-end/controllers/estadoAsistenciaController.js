// Importamos los modelos desde la carpeta /models
const db = require('../models');

// Extraemos el modelo EstadoAsistencia desde db
const EstadoAsistencia = db.EstadoAsistencia;

// Importamos el modelo Asistencia para relaciones
const Asistencia = db.Asistencia;

// Importamos operador Op para realizar búsquedas avanzadas con Sequelize
const { Op } = require('sequelize');

// Creamos el objeto controlador con todas las funciones CRUD y adicionales
const estadoAsistenciaController = {

  // ✅ Crear un nuevo estado de asistencia
  async crear(req, res) {
    const { nombre } = req.body; // Obtenemos el nombre desde el body

    // Validamos que el nombre no venga vacío
    if (!nombre || nombre.trim() === "") {
      return res.status(400).json({ error: 'El nombre es obligatorio' });
    }

    try {
      // Creamos el nuevo estado
      const creado = await EstadoAsistencia.create({ nombre });
      res.status(201).json({ mensaje: 'Estado de asistencia creado', estado: creado });
    } catch (error) {
      // Capturamos errores como duplicados, etc.
      res.status(500).json({ error: 'Error al crear el estado', detalle: error.message });
    }
  },

  // 📄 Obtener todos los estados de asistencia
  async obtenerTodos(req, res) {
    try {
      const estados = await EstadoAsistencia.findAll(); // Trae todos
      res.json(estados); // Respuesta con la lista
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Error al obtener los estados' });
    }
  },

  // 🔍 Obtener un estado por su ID (PK)
  async obtenerPorId(req, res) {
    const { id } = req.params; // ID por parámetro

    try {
      const estado = await EstadoAsistencia.findByPk(id); // Busca por ID
      if (!estado) {
        return res.status(404).json({ error: 'Estado no encontrado' });
      }
      res.json(estado); // Devuelve el estado encontrado
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Error al buscar el estado' });
    }
  },

  // 🔍 Buscar estados por nombre (parcial o exacto)
  async buscarPorNombre(req, res) {
    const { nombre } = req.query;

    // Validamos que se pase el nombre
    if (!nombre) {
      return res.status(400).json({ error: 'Debes proporcionar un nombre para buscar' });
    }

    try {
      // Busca todos los estados que contengan el nombre parcial
      const resultados = await EstadoAsistencia.findAll({
        where: {
          nombre: { [Op.like]: `%${nombre}%` }
        }
      });

      res.json(resultados); // Devuelve resultados
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Error al buscar por nombre' });
    }
  },

  // 🧮 Contar todos los estados existentes
  async contar(req, res) {
    try {
      const total = await EstadoAsistencia.count(); // Cuenta filas
      res.json({ total }); // Devuelve el total
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Error al contar los estados' });
    }
  },

  async actualizar(req, res) {
  const { id } = req.params;
  const { nombre } = req.body;

  // Validación del nombre
  if (!nombre || nombre.trim() === "") {
    return res.status(400).json({ error: 'El nombre no puede estar vacío' });
  }

  try {
    // Verificar si ya existe otro estado con el mismo nombre (y distinto id)
    const existe = await EstadoAsistencia.findOne({
      where: {
        nombre,
        id_estado_asistencia: { [Op.ne]: id }  // id diferente al actual
      }
    });

    if (existe) {
      return res.status(400).json({ error: 'Ya existe un estado con ese nombre' });
    }

    // Actualiza el nombre del estado
    const [actualizados] = await EstadoAsistencia.update(
      { nombre },
      { where: { id_estado_asistencia: id } }
    );

    if (actualizados === 0) {
      return res.status(404).json({ error: 'Estado no encontrado o sin cambios' });
    }

    res.json({ mensaje: 'Estado actualizado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar el estado' });
  }
},

  // ❌ Eliminar un estado por ID
  async eliminar(req, res) {
    const { id } = req.params;

    try {
      // Intenta eliminar por su ID
      const eliminados = await EstadoAsistencia.destroy({ where: { id_estado_asistencia: id } });

      if (eliminados === 0) {
        return res.status(404).json({ error: 'Estado no encontrado' });
      }

      res.json({ mensaje: 'Estado eliminado correctamente' });
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Error al eliminar el estado' });
    }
  },

  // 📎 Obtener asistencias asociadas a un estado
  async asistenciasPorEstado(req, res) {
    const { id } = req.params;

    try {
      // Busca el estado incluyendo las asistencias que lo referencian
      const estado = await EstadoAsistencia.findByPk(id, {
        include: {
          model: Asistencia,
          as: 'asistencias'
        }
      });

      if (!estado) {
        return res.status(404).json({ error: 'Estado no encontrado' });
      }

      res.json(estado.asistencias); // Retorna asistencias relacionadas
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Error al obtener asistencias relacionadas' });
    }
  }
};

// Exportamos el controlador para usarlo en las rutas
module.exports = estadoAsistenciaController;
