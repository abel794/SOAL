const {
  Estudiante,
  Persona,
  Usuario,
  Eps,
  EstadoAcademico,
  Acudiente,
  RelacionAcudiente,
  Estudiantegrado,
  Grado
} = require('../models');
const { Op } = require('sequelize');

module.exports = {
  // ✅ 1. Listar todos los estudiantes con sus relaciones completas
  async listarTodos(req, res) {
    try {
      const estudiantes = await Estudiante.findAll({
        include: [
          { model: Persona, as: 'persona' },
          { model: Usuario, as: 'usuario' },
          { model: Eps, as: 'eps' },
          { model: EstadoAcademico, as: 'estadoAcademico' },
          {
            model: Acudiente,
            as: 'acudiente',
            include: [
              { model: Persona, as: 'persona' },
              { model: RelacionAcudiente, as: 'relacion' }
            ]
          }
        ]
      });

      res.json(estudiantes);
    } catch (error) {
      console.error('Error al listar estudiantes:', error);
      res.status(500).json({ error: 'Error al obtener estudiantes' });
    }
  },

  // ✅ 2. Buscar estudiante por nombre, apellido o documento
 // ✅ 2. Buscar estudiante por nombre, apellido o documento
async buscar(req, res) {
  try {
    const { filtro } = req.query;

    if (!filtro) {
      return res.status(400).json({ error: 'Debe enviar un nombre o documento para buscar' });
    }

    const estudiantes = await Estudiante.findAll({
      include: [
        {
          model: Persona,
          as: 'persona',
          where: {
            [Op.or]: [
              { nombre: { [Op.like]: `%${filtro}%` } },
              { apellido: { [Op.like]: `%${filtro}%` } },
              { numero_documento: { [Op.like]: `%${filtro}%` } }
            ]
          },
          required: true // importante para aplicar el where de Persona
        },
        { model: Usuario, as: 'usuario' },
        { model: Eps, as: 'eps' },
        { model: EstadoAcademico, as: 'estadoAcademico' },
        {
          model: Acudiente,
          as: 'acudiente',
          include: [
            { model: Persona, as: 'persona' },
            { model: RelacionAcudiente, as: 'relacion' }
          ]
        }
      ]
    });

    res.json(estudiantes);
  } catch (error) {
    console.error('Error al buscar estudiante:', error);
    res.status(500).json({ error: 'Error al buscar estudiante' });
  }
},


  // ✅ 3. Contar cuántos estudiantes hay
  async contar(req, res) {
    try {
      const { id_estado_academico } = req.query;

      const condicion = {};
      if (id_estado_academico) {
        condicion.id_estado_academico = id_estado_academico;
      }

      const total = await Estudiante.count({ where: condicion });
      res.json({ total });
    } catch (error) {
      console.error('Error al contar estudiantes:', error);
      res.status(500).json({ error: 'Error al contar estudiantes' });
    }
  },

  // ✅ 4. Crear un estudiante
  async crear(req, res) {
    try {
      const {
        numero_documento,
        id_usuario,
        id_eps,
        id_estado_academico,
        id_acudiente
      } = req.body;

      const nuevo = await Estudiante.create({
        numero_documento,
        id_usuario,
        id_eps,
        id_estado_academico,
        id_acudiente
      });

      res.status(201).json(nuevo);
    } catch (error) {
      console.error('Error al crear estudiante:', error);
      res.status(500).json({ error: 'Error al crear estudiante' });
    }
  },

  // ✅ 5. Actualizar estudiante por id
  async actualizar(req, res) {
    try {
      const { id } = req.params;
      const datos = req.body;

      const estudiante = await Estudiante.findByPk(id);
      if (!estudiante) {
        return res.status(404).json({ error: 'Estudiante no encontrado' });
      }

      await estudiante.update(datos);
      res.json(estudiante);
    } catch (error) {
      console.error('Error al actualizar estudiante:', error);
      res.status(500).json({ error: 'Error al actualizar estudiante' });
    }
  },

  // ✅ 6. Eliminar estudiante por id
  async eliminar(req, res) {
    try {
      const { id } = req.params;
      const estudiante = await Estudiante.findByPk(id);

      if (!estudiante) {
        return res.status(404).json({ error: 'Estudiante no encontrado' });
      }

      await estudiante.destroy();
      res.json({ mensaje: 'Estudiante eliminado correctamente' });
    } catch (error) {
      console.error('Error al eliminar estudiante:', error);
      res.status(500).json({ error: 'Error al eliminar estudiante' });
    }
  },

  // ✅ Obtener estudiante por ID
async obtenerPorId(req, res) {
  try {
    const { id } = req.params;

    const estudiante = await Estudiante.findByPk(id, {
      include: [
        { model: Persona, as: 'persona' },
        { model: Usuario, as: 'usuario' },
        { model: Eps, as: 'eps' },
        { model: EstadoAcademico, as: 'estadoAcademico' },
        {
          model: Acudiente,
          as: 'acudiente',
          include: [
            { model: Persona, as: 'persona' },
            { model: RelacionAcudiente, as: 'relacion' }
          ]
        }
      ]
    });

    if (!estudiante) {
      return res.status(404).json({ error: 'Estudiante no encontrado' });
    }

    res.json(estudiante);
  } catch (error) {
    console.error('Error al obtener estudiante por ID:', error);
    res.status(500).json({ error: 'Error al obtener estudiante' });
  }
},


  // ✅ 7. Contar estudiantes por nombre de grado
  async contarPorGrado(req, res) {
    try {
      const { nombre } = req.params;

      const estudiantes = await Estudiante.findAll({
        include: [
          {
            model: Estudiantegrado,
            as: 'grados',
            include: [
              {
                model: Grado,
                as: 'grado',
                where: { nombre_grado: nombre }
              }
            ]
          }
        ]
      });

      res.json({ total: estudiantes.length });
    } catch (error) {
      console.error('Error al contar por grado:', error);
      res.status(500).json({ error: 'Error al contar estudiantes por grado' });
    }
  }
};
