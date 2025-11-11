const db = require('../../models');
const { EstadoAsistencia, Asistencia } = db;
const { Op } = require('sequelize');

const estadoAsistenciaController = {
  async crear(req, res) {
    const { nombre } = req.body;
    if (!nombre || nombre.trim() === "") {
      return res.status(400).json({ error: 'El nombre es obligatorio' });
    }
    try {
      const creado = await EstadoAsistencia.create({ nombre });
      res.status(201).json({ mensaje: 'Estado de asistencia creado', estado: creado });
    } catch (error) {
      res.status(500).json({ error: 'Error al crear el estado', detalle: error.message });
    }
  },

  async obtenerTodos(req, res) {
    try {
      const estados = await EstadoAsistencia.findAll();
      res.json(estados);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los estados' });
    }
  },

  async obtenerPorId(req, res) {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });
    try {
      const estado = await EstadoAsistencia.findByPk(id);
      if (!estado) return res.status(404).json({ error: 'Estado no encontrado' });
      res.json(estado);
    } catch (error) {
      res.status(500).json({ error: 'Error al buscar el estado' });
    }
  },

  async actualizar(req, res) {
    const id = parseInt(req.params.id, 10);
    const { nombre } = req.body;
    if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });
    if (!nombre || nombre.trim() === "") {
      return res.status(400).json({ error: 'El nombre no puede estar vacío' });
    }
    try {
      const existe = await EstadoAsistencia.findOne({
        where: { nombre, id_estado_asistencia: { [Op.ne]: id } }
      });
      if (existe) return res.status(400).json({ error: 'Ya existe un estado con ese nombre' });

      const [actualizados] = await EstadoAsistencia.update({ nombre }, { where: { id_estado_asistencia: id } });
      if (actualizados === 0) return res.status(404).json({ error: 'Estado no encontrado o sin cambios' });

      res.json({ mensaje: 'Estado actualizado correctamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar el estado' });
    }
  },

  async eliminar(req, res) {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });
    try {
      const eliminados = await EstadoAsistencia.destroy({ where: { id_estado_asistencia: id } });
      if (eliminados === 0) return res.status(404).json({ error: 'Estado no encontrado' });
      res.json({ mensaje: 'Estado eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar el estado' });
    }
  },

  async asistenciasPorEstado(req, res) {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });
    try {
      const estado = await EstadoAsistencia.findByPk(id, {
        include: { model: Asistencia, as: 'asistencias' }
      });
      if (!estado) return res.status(404).json({ error: 'Estado no encontrado' });
      res.json(estado.asistencias);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener asistencias relacionadas' });
    }
  }
};

module.exports = estadoAsistenciaController;
