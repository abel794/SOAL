// Importamos el modelo desde la carpeta models
const db = require('../models');
const CanalNotificacion = db.Canal_notificacion;

const canalController = {
  // ✅ Obtener todos los canales de notificación
  async obtenerTodos(req, res) {
    try {
      // Busca todos los registros en la tabla canal_notificacion
      const canales = await CanalNotificacion.findAll();
      res.json(canales); // Devuelve la lista al cliente
    } catch (error) {
      console.error('Error al obtener canales:', error);
      res.status(500).json({ error: 'Error al obtener canales de notificación' });
    }
  },

  // ✅ Obtener un canal por ID
  async obtenerPorId(req, res) {
    const { id } = req.params;

    try {
      // Busca un canal específico por su ID (clave primaria)
      const canal = await CanalNotificacion.findByPk(id);

      if (!canal) {
        return res.status(404).json({ error: 'Canal no encontrado' });
      }

      res.json(canal);
    } catch (error) {
      console.error('Error al obtener canal:', error);
      res.status(500).json({ error: 'Error al obtener canal de notificación' });
    }
  },

  // ✅ Crear un nuevo canal de notificación
  async crear(req, res) {
    try {
      // Crea un nuevo registro con los datos del body
      const nuevo = await CanalNotificacion.create(req.body);
      res.status(201).json({ mensaje: 'Canal creado correctamente', canal: nuevo });
    } catch (error) {
      console.error('Error al crear canal:', error);
      res.status(400).json({ error: 'Error al crear canal', detalle: error.message });
    }
  },

  // ✅ Actualizar un canal existente
  async actualizar(req, res) {
    const { id } = req.params;

    try {
      // Actualiza el registro con los datos enviados
      const [filas] = await CanalNotificacion.update(req.body, {
        where: { id_canal: id }
      });

      if (filas === 0) {
        return res.status(404).json({ error: 'Canal no encontrado o sin cambios' });
      }

      res.json({ mensaje: 'Canal actualizado correctamente' });
    } catch (error) {
      console.error('Error al actualizar canal:', error);
      res.status(400).json({ error: 'Error al actualizar canal', detalle: error.message });
    }
  },

  // ✅ Eliminar un canal
  async eliminar(req, res) {
    const { id } = req.params;

    try {
      // Elimina el canal si existe
      const eliminado = await CanalNotificacion.destroy({
        where: { id_canal: id }
      });

      if (eliminado === 0) {
        return res.status(404).json({ error: 'Canal no encontrado' });
      }

      res.json({ mensaje: 'Canal eliminado correctamente' });
    } catch (error) {
      console.error('Error al eliminar canal:', error);
      res.status(500).json({ error: 'Error al eliminar canal' });
    }
  }
};

// Exportamos el controlador para usarlo en las rutas
module.exports = canalController;
