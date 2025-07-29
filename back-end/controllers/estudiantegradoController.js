// controllers/estudianteGradoController.js
const { EstudianteGrado, Estudiante, Grado,Persona } = require('../models');
const { Op } = require('sequelize');

module.exports = {
  // 1. Listar todas las asignaciones estudiante-grado
  async listar(req, res) {
    try {
      const registros = await EstudianteGrado.findAll({
        include: [
          { model: Estudiante, as: 'estudiante' },
          { model: Grado,      as: 'grado'       }
        ]
      });
      res.json(registros);
    } catch (error) {
      console.error('Error al listar asignaciones:', error);
      res.status(500).json({ error: 'Error al listar asignaciones' });
    }
  },

  // 2. Asignar un estudiante a un grado
  async asignar(req, res) {
    try {
      const nueva = await EstudianteGrado.create(req.body);
      res.status(201).json(nueva);
    } catch (error) {
      console.error('Error al asignar:', error);
      res.status(500).json({ error: 'Error al asignar estudiante al grado' });
    }
  },

  // 3. Buscar asignaciones por ID de estudiante
  async buscarPorEstudiante(req, res) {
    try {
      const { id_estudiante } = req.params;
      const registros = await EstudianteGrado.findAll({
        where: { id_estudiante },
        include: [{ model: Grado, as: 'grado' }]
      });
      res.json(registros);
    } catch (error) {
      console.error('Error al buscar por estudiante:', error);
      res.status(500).json({ error: 'Error al buscar por estudiante' });
    }
  },

  // 4. Buscar asignaciones por ID de grado
  // controllers/estudianteGradoController.js
// controllers/estudianteGradoController.js

async obtenerPorGrado(req, res) {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

    try {
      const registros = await EstudianteGrado.findAll({
        where: { id_grado: id, activo: true },
        include: [{
          model: Estudiante,
          as: 'estudiante',      // alias en tu modelo EstudianteGrado.associate
          attributes: ['id_estudiante', 'numero_documento'],
          include: [{
            model: Persona,
            as: 'persona',       // alias en tu modelo Estudiante.associate
            attributes: ['nombre', 'apellido']
          }]
        }]
      });

      // Devuelvo un arreglo con id, documento, nombre y apellido
      const estudiantes = registros.map(r => {
        const e = r.estudiante;
        return {
          id_estudiante:   e.id_estudiante,
          numero_documento: e.numero_documento,
          nombre:          e.persona?.nombre   || null,
          apellido:        e.persona?.apellido || null
        };
      });

      res.json(estudiantes);
    } catch (error) {
      console.error('Error al obtenerPorGrado:', error);
      res.status(500).json({ error: 'Error interno al obtener estudiantes por grado' });
    }
  },







  // 5. Buscar asignaciones por año académico (query param: ?anio_academico=2025)
  async buscarPorAnio(req, res) {
    try {
      const { anio_academico } = req.query;
      if (!anio_academico) return res.status(400).json({ error: 'Falta anio_academico' });

      const registros = await EstudianteGrado.findAll({
        where: { anio_academico },
        include: [
          { model: Estudiante, as: 'estudiante' },
          { model: Grado,      as: 'grado'       }
        ]
      });
      res.json(registros);
    } catch (error) {
      console.error('Error al buscarPorAnio:', error);
      res.status(500).json({ error: 'Error al filtrar por año académico' });
    }
  },

  // 6. Actualizar estado de una asignación
  async actualizarEstado(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      const { activo } = req.body;
      const asign = await EstudianteGrado.findByPk(id);
      if (!asign) return res.status(404).json({ error: 'Asignación no encontrada' });

      asign.activo = activo;
      await asign.save();
      res.json({ mensaje: 'Estado actualizado', asign });
    } catch (error) {
      console.error('Error al actualizarEstado:', error);
      res.status(500).json({ error: 'Error al actualizar estado' });
    }
  },

  // 7. Contar estudiantes activos por grado
  async contarPorGrado(req, res) {
    try {
      const { id_grado, anio_academico } = req.query;
      if (!id_grado) return res.status(400).json({ error: 'Falta id_grado' });

      const where = { id_grado, activo: true };
      if (anio_academico) where.anio_academico = anio_academico;

      const total = await EstudianteGrado.count({ where });
      res.json({ total });
    } catch (error) {
      console.error('Error al contarPorGrado:', error);
      res.status(500).json({ error: 'Error al contar por grado' });
    }
  },

  // 8. Contar total de estudiantes activos
  async contarEstudiantesMatriculados(req, res) {
    try {
      const total = await EstudianteGrado.count({ where: { activo: true } });
      res.json({ total });
    } catch (error) {
      console.error('Error al contarEstudiantesMatriculados:', error);
      res.status(500).json({ error: 'Error al contar estudiantes activos' });
    }
  },

  // 9. Contar estudiantes activos por nombre de grado
  async contarPorNombreDeGrado(req, res) {
    try {
      const { nombre } = req.params;
      const total = await EstudianteGrado.count({
        include: [{
          model: Grado,
          as: 'grado',
          where: { nombre_grado: nombre }
        }],
        where: { activo: true }
      });
      res.json({ total });
    } catch (error) {
      console.error('Error al contarPorNombreDeGrado:', error);
      res.status(500).json({ error: 'Error al contar por nombre de grado' });
    }
  }
};
