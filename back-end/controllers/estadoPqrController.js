// Importamos el modelo EstadoPqr desde la carpeta de modelos
const { EstadoPqr } = require('../models');
const { Op } = require('sequelize'); // Importamos operadores de Sequelize para búsquedas

// Definimos el controlador con las funciones CRUD y búsquedas avanzadas
const estadoPqrController = {

  // ✅ Obtener todos los estados de PQR
  async obtenerTodos(req, res) {
    try {
      const lista = await EstadoPqr.findAll(); // Busca todos los registros
      res.json(lista); // Devuelve el resultado
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener estados PQR' });
    }
  },

  // 🔍 Obtener un estado de PQR por ID
  async obtenerPorId(req, res) {
    const id = req.params.id; // Obtenemos el ID desde la URL
    try {
      const estado = await EstadoPqr.findByPk(id); // Busca por clave primaria
      if (estado) {
        res.json(estado); // Devuelve el estado si lo encuentra
      } else {
        res.status(404).json({ error: 'Estado PQR no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al buscar estado PQR' });
    }
  },

  // 🔍 Buscar por nombre (ejemplo: ?nombre=Pendiente)
  async buscarPorNombre(req, res) {
    const { nombre } = req.query; // Se recibe por query string
    try {
      const resultados = await EstadoPqr.findAll({
        where: {
          nombre: { [Op.like]: `%${nombre}%` } // Búsqueda parcial
        }
      });

      if (resultados.length === 0) {
        res.status(404).json({ mensaje: 'No se encontraron coincidencias' });
      } else {
        res.json(resultados);
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al buscar estados PQR por nombre' });
    }
  },

  // 🔢 Contar cuántos estados PQR existen
  async contar(req, res) {
    try {
      const total = await EstadoPqr.count(); // Cuenta total de registros
      res.json({ totalEstadosPqr: total });
    } catch (error) {
      res.status(500).json({ error: 'Error al contar estados PQR' });
    }
  },

  // ✅ Crear un nuevo estado PQR
  async crear(req, res) {
    const { nombre } = req.body;

    // Validación básica
    if (!nombre || nombre.trim() === "") {
      return res.status(400).json({ error: 'El nombre del estado es obligatorio' });
    }

    try {
      const nuevo = await EstadoPqr.create({ nombre }); // Inserta nuevo registro
      res.status(201).json(nuevo); // Devuelve el nuevo estado
    } catch (error) {
      res.status(400).json({ error: 'Error al crear el estado PQR', detalle: error.message });
    }
  },

  // ✅ Actualizar un estado PQR existente
  async actualizar(req, res) {
    const id = req.params.id;
    const { nombre } = req.body;

    // Validación del nombre
    if (!nombre || nombre.trim() === "") {
      return res.status(400).json({ error: 'El nombre no puede estar vacío' });
    }

    try {
      const [filasActualizadas] = await EstadoPqr.update({ nombre }, {
        where: { id_estado_pqr: id } // Condición de búsqueda
      });

      if (filasActualizadas === 0) {
        res.status(404).json({ error: 'Estado PQR no encontrado o sin cambios' });
      } else {
        res.json({ mensaje: 'Estado PQR actualizado correctamente' });
      }
    } catch (error) {
      res.status(400).json({ error: 'Error al actualizar el estado PQR' });
    }
  },

  // ✅ Eliminar un estado PQR
  async eliminar(req, res) {
    const id = req.params.id;
    try {
      const filasEliminadas = await EstadoPqr.destroy({
        where: { id_estado_pqr: id }
      });

      if (filasEliminadas === 0) {
        res.status(404).json({ error: 'Estado PQR no encontrado' });
      } else {
        res.json({ mensaje: 'Estado PQR eliminado correctamente' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar el estado PQR' });
    }
  }
};

// Exportamos el controlador para usarlo en rutas
module.exports = estadoPqrController;
