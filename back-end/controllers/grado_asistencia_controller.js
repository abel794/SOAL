const { GradoAsistencia, Funcionario, Grado } = require('../models');

module.exports = {
  // Listar todos los registros
  async listar(req, res) {
    try {
      const registros = await GradoAsistencia.findAll({
        include: [
          { model: Funcionario, as: 'funcionario' },
          { model: Grado, as: 'grado' }
        ]
      });
      res.json(registros);
    } catch (error) {
      console.error('Error al obtener grado_asistencia:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  // Buscar por ID
  async obtenerPorId(req, res) {
    try {
      const { id } = req.params;
      const registro = await GradoAsistencia.findByPk(id, {
        include: [
          { model: Funcionario, as: 'funcionario' },
          { model: Grado, as: 'grado' }
        ]
      });

      if (!registro) {
        return res.status(404).json({ error: 'Registro no encontrado' });
      }

      res.json(registro);
    } catch (error) {
      console.error('Error al obtener grado_asistencia por ID:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  // Crear nuevo registro
  async crear(req, res) {
    try {
      const { id_grado, id_funcionario, fecha } = req.body;

      const nuevo = await GradoAsistencia.create({
        id_grado,
        id_funcionario,
        fecha
      });

      res.status(201).json(nuevo);
    } catch (error) {
      console.error('Error al crear grado_asistencia:', error);
      res.status(500).json({ error: 'Error al registrar asistencia' });
    }
  },

  // Actualizar
  async actualizar(req, res) {
    try {
      const { id } = req.params;
      const { id_grado, id_funcionario, fecha } = req.body;

      const registro = await GradoAsistencia.findByPk(id);

      if (!registro) {
        return res.status(404).json({ error: 'Registro no encontrado' });
      }

      registro.id_grado = id_grado;
      registro.id_funcionario = id_funcionario;
      registro.fecha = fecha;

      await registro.save();

      res.json(registro);
    } catch (error) {
      console.error('Error al actualizar grado_asistencia:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  // Eliminar
  async eliminar(req, res) {
    try {
      const { id } = req.params;

      const registro = await GradoAsistencia.findByPk(id);

      if (!registro) {
        return res.status(404).json({ error: 'Registro no encontrado' });
      }

      await registro.destroy();

      res.json({ mensaje: 'Registro eliminado correctamente' });
    } catch (error) {
      console.error('Error al eliminar grado_asistencia:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
};
