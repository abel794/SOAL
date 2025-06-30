const { EstudianteGrado, Estudiante, Grado } = require('../models');
const { Op } = require('sequelize');

module.exports = {
  // 1. Listar todas las asignaciones estudiante-grado
  async listar(req, res) {
    try {
      const registros = await EstudianteGrado.findAll({
        include: [
          { model: Estudiante, as: 'estudiante' },
          { model: Grado, as: 'grado' }
        ]
      });
      res.json(registros);
    } catch (error) {
      console.error('Error al listar estudiante-grado:', error);
      res.status(500).json({ error: 'Error al obtener registros' });
    }
  },

  // 2. Asignar grado a un estudiante
  async asignar(req, res) {
    try {
      const { id_estudiante, id_grado, anio_academico } = req.body;

      const nuevo = await EstudianteGrado.create({
        id_estudiante,
        id_grado,
        anio_academico,
        activo: true
      });

      res.status(201).json(nuevo);
    } catch (error) {
      console.error('Error al asignar grado:', error);
      res.status(500).json({ error: 'Error al asignar grado' });
    }
  },

  // 3. Buscar asignaciones por estudiante
  async buscarPorEstudiante(req, res) {
    try {
      const { id_estudiante } = req.params;

      const asignaciones = await EstudianteGrado.findAll({
        where: { id_estudiante },
        include: [{ model: Grado, as: 'grado' }]
      });

      res.json(asignaciones);
    } catch (error) {
      console.error('Error al buscar por estudiante:', error);
      res.status(500).json({ error: 'Error al buscar asignaciones' });
    }
  },

  // 4. Filtrar por año académico
  async buscarPorAnio(req, res) {
  try {
    const { anio_academico } = req.query;

    // Validar que se envíe el parámetro
    if (!anio_academico) {
      return res.status(400).json({ error: 'Debe proporcionar el año académico' });
    }

    const registros = await EstudianteGrado.findAll({
      where: { anio_academico },
      include: [
        { model: Estudiante, as: 'estudiante' },
        { model: Grado, as: 'grado' }
      ]
    });

    res.json(registros);
  } catch (error) {
    console.error('Error al filtrar por año:', error);
    res.status(500).json({ error: 'Error al filtrar asignaciones' });
  }
},

  // 5. Activar o desactivar asignación
async actualizarEstado(req, res) {
  try {
    const { id } = req.params;
    const { activo } = req.body;

    if (typeof activo !== 'boolean') {
      return res.status(400).json({ error: 'Debe enviar un valor booleano en "activo"' });
    }
    // Validar que 'activo' esté definido y sea booleano
    if (typeof activo !== 'boolean') {
      return res.status(400).json({ error: 'Debe enviar un valor booleano en "activo"' });
    }

    const registro = await EstudianteGrado.findByPk(id);

    if (!registro) {
      return res.status(404).json({ error: 'Registro no encontrado' });
    }

    registro.activo = activo;
    await registro.save();

    res.json({ mensaje: `Asignación ${activo ? 'activada' : 'desactivada'}` });
  } catch (error) {
    console.error('Error al actualizar estado:', error);
    res.status(500).json({ error: 'Error al actualizar estado de asignación' });
  }
},


  // 6. Contar estudiantes activos por grado (usando ID y opcional año)
  async contarPorGrado(req, res) {
    try {
      const { id_grado, anio_academico } = req.query;

      if (!id_grado) {
        return res.status(400).json({ error: 'Debe proporcionar id_grado' });
      }

      const condicion = {
        id_grado,
        activo: true
      };

      if (anio_academico) {
        condicion.anio_academico = anio_academico;
      }

      const total = await EstudianteGrado.count({ where: condicion });
      res.json({ total });
    } catch (error) {
      console.error('Error al contar estudiantes por grado:', error);
      res.status(500).json({ error: 'Error al contar' });
    }
  },

  // 7. Contar todos los estudiantes activos
  async contarEstudiantesMatriculados(req, res) {
    try {
      const total = await EstudianteGrado.count({
        where: { activo: true }
      });

      res.json({ total });
    } catch (error) {
      console.error('Error al contar estudiantes activos:', error);
      res.status(500).json({ error: 'Error al contar estudiantes activos' });
    }
  },

  // 8. Contar estudiantes activos por nombre del grado
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
      console.error('Error al contar por nombre de grado:', error);
      res.status(500).json({ error: 'Error al contar por nombre de grado' });
    }
  }
};
