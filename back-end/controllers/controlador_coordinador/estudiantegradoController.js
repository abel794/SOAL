// controllers/estudianteGradoController.js
const { Op, Sequelize } = require("sequelize");
const { EstudianteGrado, Estudiante, Grado, Persona, EstadoAcademico, Funcionario } = require('../../models');
const moment = require('moment');

module.exports = {
  /** 1. Listar todas las asignaciones estudiante-grado **/
  async listar(req, res) {
    try {
      const registros = await EstudianteGrado.findAll({
        include: [
          { 
            model: Estudiante, 
            as: 'estudiante',
            include: [{ model: Persona, as: 'persona' }]
          },
          { model: Grado, as: 'grado' },
          { model: EstadoAcademico, as: 'estado' },
          { 
            model: Funcionario, 
            as: 'funcionario_titular',
            include: [{ model: Persona, as: 'persona' }]
          }
        ],
        order: [['anio_academico', 'DESC'], ['activo', 'DESC']]
      });
      res.json(registros);
    } catch (error) {
      console.error('❌ Error al listar asignaciones:', error);
      res.status(500).json({ error: 'Error al listar asignaciones' });
    }
  },

  /** 2. Asignar un estudiante a un grado **/
  async asignar(req, res) {
    try {
      // Verificar si ya está asignado a un grado activo
      const existeActivo = await EstudianteGrado.findOne({
        where: { 
          id_estudiante: req.body.id_estudiante,
          activo: true 
        }
      });

      if (existeActivo) {
        return res.status(400).json({ 
          error: 'El estudiante ya tiene un grado activo. Primero debe cerrar el grado actual.' 
        });
      }

      // Crear nueva asignación
      const nueva = await EstudianteGrado.create({
        ...req.body,
        fecha_inicio: req.body.fecha_inicio || new Date(),
        id_estado: req.body.id_estado || 1 // 1 = En Curso por defecto
      });
      
      res.status(201).json(nueva);
    } catch (error) {
      console.error('❌ Error al asignar:', error);
      res.status(500).json({ error: 'Error al asignar estudiante al grado' });
    }
  },

  /** 3. Buscar asignaciones por ID de estudiante **/
  async buscarPorEstudiante(req, res) {
    try {
      const { id_estudiante } = req.params;
      const registros = await EstudianteGrado.findAll({
        where: { id_estudiante },
        include: [
          { model: Grado, as: 'grado' },
          { model: EstadoAcademico, as: 'estado' },
          { 
            model: Funcionario, 
            as: 'funcionario_titular',
            include: [{ model: Persona, as: 'persona' }]
          }
        ],
        order: [['anio_academico', 'DESC']]
      });
      res.json(registros);
    } catch (error) {
      console.error('❌ Error al buscar por estudiante:', error);
      res.status(500).json({ error: 'Error al buscar por estudiante' });
    }
  },

  /** 4. Obtener estudiantes por grado con información de Persona **/
  async obtenerPorGrado(req, res) {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

    try {
      const registros = await EstudianteGrado.findAll({
        where: { 
          id_grado: id, 
          activo: true,
          anio_academico: new Date().getFullYear() // Solo año actual
        },
        include: [
          {
            model: Estudiante,
            as: 'estudiante',
            attributes: ['id_estudiante', 'numero_documento'],
            include: [
              {
                model: Persona,
                as: 'persona',
                attributes: ['nombre', 'apellido']
              }
            ]
          },
          { model: Grado, as: 'grado' }
        ]
      });

      // Mapeamos para devolver solo los datos necesarios
      const estudiantes = registros.map((r) => {
        const e = r.estudiante;
        return {
          id_estudiante: e.id_estudiante,
          id_estudiante_grado: r.id_estudiante_grado,
          numero_documento: e.numero_documento,
          nombre: e.persona?.nombre || null,
          apellido: e.persona?.apellido || null,
          grado: r.grado?.nombre_grado || null,
          anio_academico: r.anio_academico
        };
      });

      res.json(estudiantes);
    } catch (error) {
      console.error('❌ Error al obtenerPorGrado:', error);
      res.status(500).json({ error: 'Error interno al obtener estudiantes por grado' });
    }
  },

  /** 5. Buscar asignaciones por año académico **/
  async buscarPorAnio(req, res) {
    try {
      const { anio_academico } = req.query;
      if (!anio_academico)
        return res.status(400).json({ error: 'Falta el parámetro anio_academico' });

      const registros = await EstudianteGrado.findAll({
        where: { 
          anio_academico,
          activo: true // Solo activos en ese año
        },
        include: [
          { 
            model: Estudiante, 
            as: 'estudiante',
            include: [{ model: Persona, as: 'persona' }]
          },
          { model: Grado, as: 'grado' }
        ]
      });
      res.json(registros);
    } catch (error) {
      console.error('❌ Error al buscarPorAnio:', error);
      res.status(500).json({ error: 'Error al filtrar por año académico' });
    }
  },

  /** 6. Actualizar el estado (activo/inactivo) de una asignación **/
  async actualizarEstado(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      const { activo, id_estado, fecha_finalizacion } = req.body;

      const asign = await EstudianteGrado.findByPk(id);
      if (!asign) return res.status(404).json({ error: 'Asignación no encontrada' });

      // Si se está desactivando, establecer fecha de finalización
      if (activo === false && asign.activo === true) {
        asign.fecha_finalizacion = fecha_finalizacion || new Date();
      }
      
      asign.activo = activo;
      if (id_estado) asign.id_estado = id_estado;
      await asign.save();

      res.json({ mensaje: 'Estado actualizado', asign });
    } catch (error) {
      console.error('❌ Error al actualizarEstado:', error);
      res.status(500).json({ error: 'Error al actualizar estado' });
    }
  },

  /** 7. Contar estudiantes activos por grado **/
  async contarPorGrado(req, res) {
    try {
      const { id_grado, anio_academico } = req.query;
      if (!id_grado)
        return res.status(400).json({ error: 'Falta el parámetro id_grado' });

      const where = { 
        id_grado, 
        activo: true,
        anio_academico: anio_academico || new Date().getFullYear()
      };

      const total = await EstudianteGrado.count({ where });
      res.json({ total });
    } catch (error) {
      console.error('❌ Error al contarPorGrado:', error);
      res.status(500).json({ error: 'Error al contar por grado' });
    }
  },

  /** 8. Contar total de estudiantes activos **/
  async contarEstudiantesMatriculados(req, res) {
    try {
      const total = await EstudianteGrado.count({ 
        where: { 
          activo: true,
          anio_academico: new Date().getFullYear()
        } 
      });
      res.json({ total });
    } catch (error) {
      console.error('❌ Error al contarEstudiantesMatriculados:', error);
      res.status(500).json({ error: 'Error al contar estudiantes activos' });
    }
  },

  /** 9. Contar estudiantes activos por nombre de grado **/
  async contarPorNombreDeGrado(req, res) {
    try {
      const { nombre } = req.params;
      const total = await EstudianteGrado.count({
        include: [
          {
            model: Grado,
            as: 'grado',
            where: { nombre_grado: nombre }
          }
        ],
        where: { 
          activo: true,
          anio_academico: new Date().getFullYear()
        }
      });

      res.json({ total });
    } catch (error) {
      console.error('❌ Error al contarPorNombreDeGrado:', error);
      res.status(500).json({ error: 'Error al contar por nombre de grado' });
    }
  },

  /** 10. PROMOVER ESTUDIANTE - Pasar al siguiente grado **/
  async promoverEstudiante(req, res) {
    const transaction = await sequelize.transaction();
    
    try {
      const { id_estudiante } = req.params;
      const { 
        id_nuevo_grado, 
        anio_academico, 
        id_funcionario_titular,
        observaciones,
        id_estado_actual = 2 // 2 = Aprobado por defecto
      } = req.body;

      // 1. Buscar el grado actual activo
      const gradoActual = await EstudianteGrado.findOne({
        where: { 
          id_estudiante, 
          activo: true 
        },
        include: [{ model: Grado, as: 'grado' }],
        transaction
      });

      if (!gradoActual) {
        await transaction.rollback();
        return res.status(404).json({ error: 'No se encontró un grado activo para este estudiante' });
      }

      // 2. Cerrar el grado actual
      await gradoActual.update({
        activo: false,
        fecha_finalizacion: new Date(),
        id_estado: id_estado_actual,
        observaciones: observaciones || `Promovido a nuevo grado - ${moment().format('YYYY-MM-DD')}`
      }, { transaction });

      // 3. Crear nuevo registro para el nuevo grado
      const nuevoGrado = await EstudianteGrado.create({
        id_estudiante,
        id_grado: id_nuevo_grado,
        anio_academico: anio_academico || new Date().getFullYear() + 1,
        activo: true,
        id_estado: 1, // 1 = En Curso
        id_funcionario_titular,
        fecha_inicio: new Date()
      }, { transaction });

      await transaction.commit();

      res.json({
        success: true,
        message: `Estudiante promovido exitosamente`,
        datos: {
          grado_anterior: gradoActual.grado?.nombre_grado,
          nuevo_grado: await Grado.findByPk(id_nuevo_grado, { attributes: ['nombre_grado'] }),
          anio_academico: nuevoGrado.anio_academico,
          fecha_promocion: new Date()
        }
      });

    } catch (error) {
      await transaction.rollback();
      console.error('❌ Error al promover estudiante:', error);
      res.status(500).json({ error: 'Error al promover estudiante' });
    }
  },

  /** 11. REPROBAR ESTUDIANTE - Repetir el mismo grado **/
  async reprobarEstudiante(req, res) {
    const transaction = await sequelize.transaction();
    
    try {
      const { id_estudiante } = req.params;
      const { 
        observaciones,
        id_funcionario_titular,
        id_estado_actual = 3 // 3 = Reprobado por defecto
      } = req.body;

      // 1. Buscar el grado actual activo
      const gradoActual = await EstudianteGrado.findOne({
        where: { 
          id_estudiante, 
          activo: true 
        },
        include: [{ model: Grado, as: 'grado' }],
        transaction
      });

      if (!gradoActual) {
        await transaction.rollback();
        return res.status(404).json({ error: 'No se encontró un grado activo para este estudiante' });
      }

      // 2. Cerrar el grado actual como reprobado
      await gradoActual.update({
        activo: false,
        fecha_finalizacion: new Date(),
        id_estado: id_estado_actual,
        observaciones: observaciones || `Reprobado - ${moment().format('YYYY-MM-DD')}`
      }, { transaction });

      // 3. Crear nuevo registro para repetir el MISMO grado
      const nuevoRegistro = await EstudianteGrado.create({
        id_estudiante,
        id_grado: gradoActual.id_grado, // Mismo grado
        anio_academico: new Date().getFullYear() + 1, // Siguiente año
        activo: true,
        id_estado: 1, // 1 = En Curso
        id_funcionario_titular,
        fecha_inicio: new Date()
      }, { transaction });

      await transaction.commit();

      res.json({
        success: true,
        message: `Estudiante reprobado - Repite el grado`,
        datos: {
          grado_repetido: gradoActual.grado?.nombre_grado,
          anio_academico: nuevoRegistro.anio_academico,
          fecha_reprobacion: new Date()
        }
      });

    } catch (error) {
      await transaction.rollback();
      console.error('❌ Error al reprobar estudiante:', error);
      res.status(500).json({ error: 'Error al reprobar estudiante' });
    }
  },

  /** 12. OBTENER HISTORIAL ACADÉMICO COMPLETO **/
  async obtenerHistorialCompleto(req, res) {
    try {
      const { id_estudiante } = req.params;
      
      const historial = await EstudianteGrado.findAll({
        where: { id_estudiante },
        include: [
          { 
            model: Grado, 
            as: 'grado',
            attributes: ['id_grado', 'nombre_grado', 'descripcion']
          },
          { 
            model: EstadoAcademico, 
            as: 'estado',
            attributes: ['id_estado', 'nombre', 'descripcion']
          },
          { 
            model: Funcionario, 
            as: 'funcionario_titular',
            attributes: ['id_funcionario'],
            include: [{
              model: Persona,
              as: 'persona',
              attributes: ['nombre', 'apellido']
            }]
          }
        ],
        order: [['anio_academico', 'DESC']]
      });

      // Calcular estadísticas
      const estadisticas = {
        total_grados_cursados: historial.length,
        grados_aprobados: historial.filter(h => h.id_estado === 2).length,
        grados_reprobados: historial.filter(h => h.id_estado === 3).length,
        años_en_sistema: new Set(historial.map(h => h.anio_academico)).size,
        grado_actual: historial.find(h => h.activo === true)?.grado?.nombre_grado || null
      };

      res.json({
        historial,
        estadisticas,
        resumen: `El estudiante ha cursado ${estadisticas.total_grados_cursados} grados, ${estadisticas.grados_aprobados} aprobados y ${estadisticas.grados_reprobados} reprobados.`
      });

    } catch (error) {
      console.error('❌ Error al obtener historial:', error);
      res.status(500).json({ error: 'Error al obtener historial académico' });
    }
  },

  /** 13. OBTENER GRADO ACTUAL DE UN ESTUDIANTE **/
  async obtenerGradoActual(req, res) {
    try {
      const { id_estudiante } = req.params;
      
      const gradoActual = await EstudianteGrado.findOne({
        where: { 
          id_estudiante, 
          activo: true 
        },
        include: [
          { 
            model: Grado, 
            as: 'grado',
            attributes: ['id_grado', 'nombre_grado', 'descripcion']
          },
          { 
            model: EstadoAcademico, 
            as: 'estado',
            attributes: ['id_estado', 'nombre']
          },
          { 
            model: Funcionario, 
            as: 'funcionario_titular',
            include: [{
              model: Persona,
              as: 'persona',
              attributes: ['nombre', 'apellido']
            }]
          }
        ]
      });

      if (!gradoActual) {
        return res.status(404).json({ 
          error: 'No se encontró grado activo para este estudiante',
          tiene_grado: false
        });
      }

      res.json({
        tiene_grado: true,
        grado_actual: gradoActual,
        anio_academico: gradoActual.anio_academico,
        estado: gradoActual.estado?.nombre
      });

    } catch (error) {
      console.error('❌ Error al obtener grado actual:', error);
      res.status(500).json({ error: 'Error al obtener grado actual' });
    }
  },

  /** 14. LISTAR ESTUDIANTES POR GRADO Y AÑO (solo activos) **/
  async listarPorGradoYAnio(req, res) {
    try {
      const { id_grado, anio_academico } = req.query;
      
      if (!id_grado || !anio_academico) {
        return res.status(400).json({ 
          error: 'Se requieren los parámetros id_grado y anio_academico' 
        });
      }

      const estudiantes = await EstudianteGrado.findAll({
        where: { 
          id_grado, 
          anio_academico,
          activo: true
        },
        include: [
          {
            model: Estudiante,
            as: 'estudiante',
            attributes: ['id_estudiante', 'numero_documento'],
            include: [{
              model: Persona,
              as: 'persona',
              attributes: ['nombre', 'apellido', 'telefono', 'correo']
            }]
          },
          { model: Grado, as: 'grado' }
        ],
        order: [['estudiante', 'persona', 'apellido', 'ASC']]
      });

      res.json({
        total: estudiantes.length,
        grado: (await Grado.findByPk(id_grado))?.nombre_grado,
        anio_academico,
        estudiantes
      });

    } catch (error) {
      console.error('❌ Error al listar por grado y año:', error);
      res.status(500).json({ error: 'Error al listar estudiantes' });
    }
  },

  /** 15. VERIFICAR SI ESTUDIANTE PUEDE SER PROMOVIDO **/
  async verificarPromocion(req, res) {
    try {
      const { id_estudiante } = req.params;
      
      // 1. Verificar que tenga grado activo
      const gradoActual = await EstudianteGrado.findOne({
        where: { id_estudiante, activo: true },
        include: [{ model: Grado, as: 'grado' }]
      });

      if (!gradoActual) {
        return res.json({
          puede_promover: false,
          motivo: 'No tiene un grado activo asignado'
        });
      }

      // 2. Verificar observaciones graves pendientes
      const observacionesGraves = await sequelize.models.Observacion.count({
        where: {
          id_estudiante,
          id_gravedad: 3, // Grave
          fecha: { [Op.gte]: moment().subtract(6, 'months').toDate() }
        }
      });

      // 3. Verificar si tiene sanciones activas
      const sancionesActivas = await sequelize.models.Sancion.count({
        where: {
          id_estudiante,
          estado: 'activa'
        }
      });

      // 4. Obtener siguiente grado disponible
      const siguienteGrado = await Grado.findOne({
        where: {
          orden: gradoActual.grado.orden + 1
        }
      });

      const puedePromover = (
        observacionesGraves === 0 &&
        sancionesActivas === 0 &&
        siguienteGrado !== null
      );

      res.json({
        puede_promover: puedePromover,
        grado_actual: gradoActual.grado.nombre_grado,
        siguiente_grado: siguienteGrado?.nombre_grado || null,
        observaciones_graves: observacionesGraves,
        sanciones_activas: sancionesActivas,
        condiciones: {
          sin_observaciones_graves: observacionesGraves === 0,
          sin_sanciones_activas: sancionesActivas === 0,
          existe_siguiente_grado: siguienteGrado !== null
        }
      });

    } catch (error) {
      console.error('❌ Error al verificar promoción:', error);
      res.status(500).json({ error: 'Error al verificar promoción' });
    }
  }
};

// Asegúrate de tener sequelize disponible
