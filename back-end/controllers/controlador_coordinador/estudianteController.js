// controllers/estudianteController.js

const {
  Estudiante,
  Persona,
  Usuario,
  Eps,
  EstadoAcademico,
  Acudiente,
  RelacionAcudiente,
  Estudiantegrado,
  Grado,
  EstudianteAcudiente,
} = require('../../models');
const { Op } = require('sequelize');

module.exports = {
  // 1. Listar todos
  async listarTodos(req, res) {
    try {
      console.log('[listarTodos] Consultando todos los estudiantes...');
      const estudiantes = await Estudiante.findAll({
        include: [
          { model: Persona, as: 'persona' },
          { model: Usuario, as: 'usuario' },
          { model: Eps, as: 'eps' },
          { model: EstadoAcademico, as: 'estadoAcademico' },
          {
            model: Acudiente,
            as: 'acudientes',
            through: { attributes: [] },
            include: [
              { model: Persona, as: 'persona' },
              { model: RelacionAcudiente, as: 'relacion' }
            ]
          }
        ]
      });
      console.log(`[listarTodos] Encontrados ${estudiantes.length} estudiantes`);
      res.json(estudiantes);
    } catch (error) {
      console.error('[listarTodos] Error al listar estudiantes:', error);
      res.status(500).json({ error: 'Error al obtener estudiantes' });
    }
  },

  // 2. Buscar con filtro (CORREGIDO)
  async buscar(req, res) {
    try {
      const { filtro } = req.query;
      if (!filtro) {
        console.warn('[buscar] Falta parámetro ?filtro=');
        return res.status(400).json({ error: 'Debe enviar un nombre o documento para buscar' });
      }

      console.log(`[buscar] Iniciando búsqueda con filtro = "${filtro}"`);
      const estudiantes = await Estudiante.findAll({
        where: {}, // sin condición adicional aquí
        include: [
          // Filtrar por nombre/apellido/documento en la persona del estudiante
          {
            model: Persona,
            as: 'persona',
            where: {
              [Op.or]: [
                { nombre:           { [Op.like]: `%${filtro}%` } },
                { apellido:         { [Op.like]: `%${filtro}%` } },
                { numero_documento: { [Op.like]: `%${filtro}%` } }
              ]
            },
            required: true,
            attributes: ['nombre','apellido','numero_documento']
          },
          { model: Usuario,         as: 'usuario',         attributes: ['id_usuario'] },
          { model: Eps,             as: 'eps',             attributes: ['nombre'] },
          { model: EstadoAcademico, as: 'estadoAcademico', attributes: ['nombre'] },

          // Aquí incluimos directamente los acudientes
          {
            model: Acudiente,
            as: 'acudientes',
            through: { attributes: ['id_estudiante_acudiente'] }, 
            attributes: ['id_acudiente','numero_documento'],
            include: [
              {
                model: Persona,
                as: 'persona',
                attributes: ['nombre','apellido','telefono','direccion','correo']
              },
              {
                model: RelacionAcudiente,
                as: 'relacion',
                attributes: ['nombre']
              }
            ]
          }
        ]
      });

      console.log(`[buscar] Estudiantes encontrados: ${estudiantes.length}`);
      estudiantes.forEach(e =>
        console.log('  • acudientes:', e.acudientes.map(a => a.id_acudiente))
      );

      return res.json(estudiantes);
    } catch (error) {
      console.error('[buscar] Error al buscar estudiante:', error);
      return res.status(500).json({ error: 'Error al buscar estudiante' });
    }
  },

  // 3. Contar
  async contar(req, res) {
    try {
      const { id_estado_academico } = req.query;
      console.log('[contar] Filtro id_estado_academico =', id_estado_academico);
      const where = {};
      if (id_estado_academico) where.id_estado_academico = id_estado_academico;
      const total = await Estudiante.count({ where });
      console.log('[contar] Total de estudiantes:', total);
      res.json({ total });
    } catch (error) {
      console.error('[contar] Error al contar estudiantes:', error);
      res.status(500).json({ error: 'Error al contar estudiantes' });
    }
  },

  // 4. Crear
  async crear(req, res) {
    try {
      console.log('[crear] Datos:', req.body);
      const { numero_documento, id_usuario, id_eps, id_estado_academico, acudientes } = req.body;
      const nuevo = await Estudiante.create({ numero_documento, id_usuario, id_eps, id_estado_academico });
      if (Array.isArray(acudientes) && acudientes.length) {
        console.log('[crear] Asociando acudientes:', acudientes);
        await nuevo.setAcudientes(acudientes);
      }
      console.log('[crear] Estudiante creado con ID:', nuevo.id_estudiante);
      res.status(201).json(nuevo);
    } catch (error) {
      console.error('[crear] Error al crear estudiante:', error);
      res.status(500).json({ error: 'Error al crear estudiante' });
    }
  },

  // 5. Actualizar
  async actualizar(req, res) {
    try {
      const { id } = req.params;
      console.log('[actualizar] Estudiante ID:', id, 'Datos:', req.body);
      const { acudientes, ...datos } = req.body;
      const est = await Estudiante.findByPk(id);
      if (!est) {
        console.warn('[actualizar] Estudiante no encontrado:', id);
        return res.status(404).json({ error: 'Estudiante no encontrado' });
      }
      await est.update(datos);
      if (Array.isArray(acudientes)) {
        console.log('[actualizar] Actualizando acudientes:', acudientes);
        await est.setAcudientes(acudientes);
      }
      console.log('[actualizar] Actualización exitosa para ID:', id);
      res.json(est);
    } catch (error) {
      console.error('[actualizar] Error al actualizar estudiante:', error);
      res.status(500).json({ error: 'Error al actualizar estudiante' });
    }
  },

  // 6. Eliminar
  async eliminar(req, res) {
    try {
      const { id } = req.params;
      console.log('[eliminar] Estudiante ID:', id);
      const est = await Estudiante.findByPk(id);
      if (!est) {
        console.warn('[eliminar] Estudiante no encontrado:', id);
        return res.status(404).json({ error: 'Estudiante no encontrado' });
      }
      await est.setAcudientes([]);  // limpia pivotes
      await est.destroy();
      console.log('[eliminar] Estudiante eliminado:', id);
      res.json({ mensaje: 'Estudiante eliminado correctamente' });
    } catch (error) {
      console.error('[eliminar] Error al eliminar estudiante:', error);
      res.status(500).json({ error: 'Error al eliminar estudiante' });
    }
  },

  // 7. Obtener por ID
  async obtenerPorId(req, res) {
    try {
      const { id } = req.params;
      console.log('[obtenerPorId] Estudiante ID:', id);
      const est = await Estudiante.findByPk(id, {
        include: [
          { model: Persona,           as: 'persona' },
          { model: Usuario,           as: 'usuario' },
          { model: Eps,               as: 'eps' },
          { model: EstadoAcademico,   as: 'estadoAcademico' },
          {
            model: Acudiente,
            as: 'acudientes',
            through: { attributes: [] },
            include: [
              { model: Persona,           as: 'persona' },
              { model: RelacionAcudiente, as: 'relacion' }
            ]
          }
        ]
      });
      if (!est) {
        console.warn('[obtenerPorId] Estudiante no encontrado:', id);
        return res.status(404).json({ error: 'Estudiante no encontrado' });
      }
      console.log('[obtenerPorId] Estudiante hallado:', est.id_estudiante);
      res.json(est);
    } catch (error) {
      console.error('[obtenerPorId] Error al obtener estudiante:', error);
      res.status(500).json({ error: 'Error al obtener estudiante' });
    }
  },

  // 8. Contar por grado
  async contarPorGrado(req, res) {
    try {
      const { nombre } = req.params;
      console.log('[contarPorGrado] Nombre de grado:', nombre);
      const estudiantes = await Estudiante.findAll({
        include: [
          {
            model: Estudiantegrado,
            as: 'grados',
            include: [
              { model: Grado, as: 'grado', where: { nombre_grado: nombre } }
            ]
          }
        ]
      });
      console.log('[contarPorGrado] Total estudiantes en grado:', estudiantes.length);
      res.json({ total: estudiantes.length });
    } catch (error) {
      console.error('[contarPorGrado] Error al contar por grado:', error);
      res.status(500).json({ error: 'Error al contar estudiantes por grado' });
    }
  },
  // 9. Obtener estudiantes asignados al acudiente logueado
async obtenerPorAcudiente(req, res) {
  try {
    const id_usuario = req.usuario.id_usuario;
    console.log('[obtenerPorAcudiente] Inicio. Payload token:', req.usuario);

    // Buscar el acudiente
    const acudiente = await Acudiente.findOne({
      where: { id_usuario },
      attributes: ['id_acudiente']
    });
    if (!acudiente) {
      console.error('[obtenerPorAcudiente] Acudiente no encontrado');
      return res.status(404).json({ error: 'Acudiente no encontrado' });
    }

    console.log('[obtenerPorAcudiente] id_acudiente encontrado =', acudiente.id_acudiente);

    // Buscar los estudiantes asignados
    const asignaciones = await EstudianteAcudiente.findAll({
      where: { id_acudiente: acudiente.id_acudiente },
      include: [
        {
          model: Estudiante,
          as: 'estudiante',
          include: [
            { model: Persona,
              as: 'persona',
              attributes: ['nombre','apellido']
             }
          ]
        }
      ]
    });
    const estudiantes = asignaciones.map(a => a.estudiante);
    console.log('[obtenerPorAcudiente] Estudiantes asignados:', estudiantes.map(e => e.id_estudiante));

    res.json(estudiantes);
  } catch (error) {
    console.error('[obtenerPorAcudiente] Error:', error);
    res.status(500).json({ error: 'Error al obtener estudiantes del acudiente' });
  }
}

};
