// controllers/citaController.js

const db = require('../../models');
const {
  Cita,
  Estudiante,
  Acudiente,
  Persona,
  Funcionario,
  Usuario,
  EstadoUsuario,
  EstudianteAcudiente
} = db;
const { Op } = require('sequelize');

const citaController = {
  // ✅ Crear una nueva cita
  async crearCita(req, res) {
    try {
      console.log('📥 [crearCita] Datos recibidos:', req.body);

      const {
        id_estudiante,
        id_funcionario,
        motivo,
        fecha_cita,
        id_acudiente: bodyAc
      } = req.body;

      // Validar campos obligatorios
      if (!id_estudiante || !id_funcionario || !motivo) {
        console.warn(
          '⚠️ [crearCita] Faltan datos obligatorios:',
          { id_estudiante, id_funcionario, motivo }
        );
        return res
          .status(400)
          .json({ mensaje: 'Debes enviar id_estudiante, id_funcionario y motivo' });
      }

      // 1) Obtener id_acudiente: usar el que envía el front o buscar en pivote
      let idAcud = bodyAc;
      if (!idAcud) {
        console.log(
          '🔎 [crearCita] No se recibió id_acudiente, buscando en pivote...'
        );
        const vinculo = await EstudianteAcudiente.findOne({
          where: { id_estudiante },
          attributes: ['id_acudiente']
        });

        if (!vinculo) {
          console.warn(
            '❌ [crearCita] No existe vínculo Estudiante↔Acudiente para id_estudiante =',
            id_estudiante
          );
          return res
            .status(404)
            .json({ mensaje: 'No se encontró acudiente para este estudiante' });
        }

        idAcud = vinculo.id_acudiente;
        console.log(
          '✅ [crearCita] id_acudiente obtenido del pivote:',
          idAcud
        );
      }

      // 2) Validar que el acudiente existe y traer su persona para debug
      const acudiente = await Acudiente.findByPk(idAcud, {
        include: [
          {
            model: Persona,
            as: 'persona',
            attributes: ['nombre', 'apellido', 'telefono', 'numero_documento']
          }
        ]
      });

      if (!acudiente) {
        console.warn(
          '❌ [crearCita] Acudiente inválido, no existe con id =',
          idAcud
        );
        return res.status(404).json({ mensaje: 'Acudiente inválido' });
      }

      console.log(
        '👤 [crearCita] Acudiente encontrado:',
        acudiente.persona
      );

      // 3) Crear la cita
      console.log('🛠️ [crearCita] Creando cita en BDD...');
      const nuevaCita = await Cita.create({
        id_estudiante,
        id_acudiente: idAcud,
        id_funcionario,
        motivo,
        fecha_cita: fecha_cita || new Date()
      });

      console.log(
        '✅ [crearCita] Cita creada con ID:',
        nuevaCita.id_cita
      );
      return res.status(201).json({ mensaje: 'Cita creada', cita: nuevaCita });

    } catch (error) {
      console.error('❌ [crearCita] Error interno:', error);
      return res
        .status(500)
        .json({ mensaje: 'Error al crear cita', detalle: error.message });
    }
  },

  // ✅ Obtener todas las citas
  async obtenerCitas(req, res) {
    try {
      console.log('🔍 [obtenerCitas] Buscando todas las citas...');

      const citas = await Cita.findAll({
        include: [
          {
            model: Estudiante,
            as: 'estudiante',
            include: [
              { model: Persona, as: 'persona' },
              {
                model: Acudiente,
                as: 'acudientes',
                include: [{ model: Persona, as: 'persona' }],
                through: { attributes: [] }
              }
            ]
          },
          {
            model: Acudiente,
            as: 'acudiente',
            include: [{ model: Persona, as: 'persona' }]
          },
          {
            model: Funcionario,
            as: 'funcionario',
            include: [
              {
                model: Usuario,
                as: 'usuario',
                include: [{ model: EstadoUsuario, as: 'estado' }]
              }
            ]
          }
        ]
      });

      console.log(`✅ [obtenerCitas] Total de citas: ${citas.length}`);
      return res.json(citas);
    } catch (error) {
      console.error('❌ [obtenerCitas] Error interno:', error);
      return res
        .status(500)
        .json({ mensaje: 'Error al obtener citas', detalle: error.message });
    }
  },

  // 🔍 Buscar citas por documento
  async buscarPorDocumento(req, res) {
    const { documento } = req.query;
    if (!documento) {
      console.warn(
        '⚠️ [buscarPorDocumento] Falta parámetro ?documento='
      );
      return res.status(400).json({
        mensaje: 'Debe enviar el parámetro ?documento='
      });
    }

    try {
      console.log(
        `🔍 [buscarPorDocumento] Buscando citas con documento = ${documento}`
      );

      const citas = await Cita.findAll({
        include: [
          {
            model: Estudiante,
            as: 'estudiante',
            include: {
              model: Persona,
              as: 'persona',
              where: { numero_documento: documento }
            }
          },
          {
            model: Acudiente,
            as: 'acudiente',
            include: {
              model: Persona,
              as: 'persona',
              where: { numero_documento: documento }
            }
          }
        ]
      });

      if (citas.length === 0) {
        console.warn('⚠️ [buscarPorDocumento] No se encontraron citas');
        return res
          .status(404)
          .json({ mensaje: 'No se encontraron citas' });
      }

      console.log(
        `✅ [buscarPorDocumento] Citas encontradas: ${citas.length}`
      );
      return res.json({ total: citas.length, citas });
    } catch (error) {
      console.error('❌ [buscarPorDocumento] Error interno:', error);
      return res
        .status(500)
        .json({ mensaje: 'Error al buscar por documento' });
    }
  },

  // ✅ Contar total de citas
  async contarCitas(req, res) {
    try {
      console.log('📊 [contarCitas] Contando citas...');
      const total = await Cita.count();
      console.log(`✅ [contarCitas] Total de citas: ${total}`);
      return res.json({ totalCitas: total });
    } catch (error) {
      console.error('❌ [contarCitas] Error interno:', error);
      return res
        .status(500)
        .json({ mensaje: 'Error al contar citas' });
    }
  },

  // 🔍 Buscar citas por nombre
  async buscarPorNombre(req, res) {
    const { nombre } = req.query;
    if (!nombre) {
      console.warn(
        '⚠️ [buscarPorNombre] Falta parámetro ?nombre='
      );
      return res.status(400).json({
        mensaje: 'Debe enviar el parámetro ?nombre='
      });
    }

    try {
      console.log(
        `🔍 [buscarPorNombre] Buscando citas con nombre LIKE ${nombre}`
      );

      const citas = await Cita.findAll({
        include: [
          {
            model: Estudiante,
            as: 'estudiante',
            include: {
              model: Persona,
              as: 'persona',
              where: {
                nombre: { [Op.like]: `%${nombre}%` }
              }
            }
          },
          {
            model: Acudiente,
            as: 'acudiente',
            include: {
              model: Persona,
              as: 'persona',
              where: {
                nombre: { [Op.like]: `%${nombre}%` }
              }
            }
          }
        ]
      });

      if (citas.length === 0) {
        console.warn('⚠️ [buscarPorNombre] No se encontraron citas');
        return res
          .status(404)
          .json({ mensaje: 'No se encontraron citas' });
      }

      console.log(
        `✅ [buscarPorNombre] Citas encontradas: ${citas.length}`
      );
      return res.json({ total: citas.length, citas });
    } catch (error) {
      console.error('❌ [buscarPorNombre] Error interno:', error);
      return res
        .status(500)
        .json({ mensaje: 'Error al buscar por nombre' });
    }
  },
  

// 🔍 Obtener citas por ID de acudiente

// controllers/citaController.js

};

module.exports = citaController;
