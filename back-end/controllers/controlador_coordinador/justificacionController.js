const db = require('../../models');
const Justificacion = db.Justificacion;
const Estudiante = db.Estudiante;
const Persona = db.Persona;
const { Op } = require('sequelize');

const justificacionController = {
  

  // 🔄 Crear una justificación con archivo BLOB
  async crear(req, res) {
  console.log('📥 [crear] Iniciando creación de justificación...');
  try {
    const archivo = req.file;
    console.log('📦 Archivo recibido:', archivo?.originalname);

    if (!archivo) {
      return res.status(400).json({ error: 'No se recibió ningún archivo' });
    }

    // 🔍 Buscar estudiante asociado al número de documento del acudiente
    const estudiante = await Estudiante.findOne({
      include: [{
        model: Acudiente,
        where: { numero_documento: req.usuario.numero_documento }
      }]
    });

    if (!estudiante) {
      return res.status(404).json({ error: "No se encontró estudiante asociado al acudiente" });
    }

    const nueva = await Justificacion.create({
      id_estudiante: estudiante.id,
      nombreArchivo: archivo.originalname,
      mimeType: archivo.mimetype,
      archivo: archivo.buffer,
      fecha: req.body.fecha,
      motivo: req.body.motivo
    });

    console.log('✅ Justificación creada con ID:', nueva.id);
    res.status(201).json(nueva);
  } catch (error) {
    console.error('❌ Error al crear justificación:', error);
    res.status(400).json({ error: 'No se pudo crear la justificación', detalle: error.message });
  }
},

  // 📃 Listar todas las justificaciones
  async listarTodas(req, res) {
    console.log('📋 [listarTodas] Consultando todas las justificaciones...');
    try {
      const justificaciones = await Justificacion.findAll({
        include: {
          model: Estudiante,
          as: 'estudiante',
          include: {
            model: Persona,
            as: 'persona',
            attributes: ['nombre', 'apellido']
          }
        },
        order: [['fecha', 'DESC']]
      });
      console.log(`📊 Se encontraron ${justificaciones.length} justificaciones`);
      res.json(justificaciones);
    } catch (error) {
      console.error('❌ Error al obtener justificaciones:', error);
      res.status(500).json({ error: 'Error al obtener las justificaciones', detalle: error.message });
    }
  },

  // 🔍 Buscar por estudiante
  async buscarPorEstudiante(req, res) {
    const id = req.params.id;
    console.log(`🔎 [buscarPorEstudiante] Buscando justificaciones del estudiante ID: ${id}`);
    try {
      const resultado = await Justificacion.findAll({
        where: { id_estudiante: id },
        order: [['fecha', 'DESC']]
      });
      console.log(`📊 Se encontraron ${resultado.length} justificaciones para el estudiante`);
      res.json(resultado);
    } catch (error) {
      console.error('❌ Error al buscar por estudiante:', error);
      res.status(500).json({ error: 'Error en la consulta', detalle: error.message });
    }
  },

  // 🔎 Buscar por fecha específica o rango
  async buscarPorFecha(req, res) {
    const { desde, hasta } = req.query;
    console.log(`📅 [buscarPorFecha] Buscando justificaciones desde: ${desde} hasta: ${hasta}`);
    try {
      const condiciones = {};
      if (desde && hasta) {
        condiciones.fecha = { [Op.between]: [desde, hasta] };
      } else if (desde) {
        condiciones.fecha = { [Op.gte]: desde };
      } else if (hasta) {
        condiciones.fecha = { [Op.lte]: hasta };
      }

      const resultados = await Justificacion.findAll({
        where: condiciones,
        include: {
          model: Estudiante,
          as: 'estudiante',
          include: {
            model: Persona,
            as: 'persona',
            attributes: ['nombre', 'apellido']
          }
        },
        order: [['fecha', 'DESC']]
      });

      console.log(`📊 Se encontraron ${resultados.length} justificaciones en el rango solicitado`);
      res.json(resultados);
    } catch (error) {
      console.error('❌ Error en búsqueda por fecha:', error);
      res.status(500).json({ error: 'Error en búsqueda', detalle: error.message });
    }
  },

  // 📥 Descargar archivo
  async descargar(req, res) {
    const id = req.params.id;
    console.log(`📤 [descargar] Descargando archivo de justificación ID: ${id}`);
    try {
      const justificacion = await Justificacion.findByPk(id);
      if (!justificacion) {
        console.warn('⚠️ Justificación no encontrada');
        return res.status(404).json({ error: 'Justificación no encontrada' });
      }

      console.log(`📁 Enviando archivo: ${justificacion.nombreArchivo}`);
      res.set('Content-Type', justificacion.mimeType);
      res.set('Content-Disposition', `attachment; filename="${justificacion.nombreArchivo}"`);
      res.send(justificacion.archivo);
    } catch (error) {
      console.error('❌ Error al descargar archivo:', error);
      res.status(500).json({ error: 'No se pudo descargar el archivo', detalle: error.message });
    }
  }
};

module.exports = justificacionController;
