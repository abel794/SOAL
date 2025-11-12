const db = require('../../models');
const Justificacion = db.Justificacion;
const Estudiante = db.Estudiante;
const Acudiente = db.Acudiente;
const Persona = db.Persona;
const Funcionario = db.Funcionario; // si también lo usas
const Usuario = db.Usuario;         // si haces joins por usuario
const Grado = db.Grado;             // si consultas el grupo del profesor

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

    // usuario desde token (soportamos ambas convenciones req.usuario o req.user)
    const tokenUser = req.usuario || req.user || null;

    // 1) Si enviaron id_estudiante explícito, lo usamos directamente
    let idEstudiante = req.body.id_estudiante ? Number(req.body.id_estudiante) : null;

    // 2) Si enviaron numero_documento en body, buscamos el estudiante por documento
    if (!idEstudiante && req.body.numero_documento) {
      const estudiantePorDoc = await Estudiante.findOne({
        where: { numero_documento: req.body.numero_documento }
      });
      if (!estudiantePorDoc) {
        return res.status(404).json({ error: 'No se encontró estudiante con ese número de documento' });
      }
      idEstudiante = estudiantePorDoc.id_estudiante;
    }

    // 3) Si todavía no tenemos idEstudiante, intentamos resolverlo desde el token -> acudiente -> sus estudiantes
    let estudianteEncontradoDesdeAcudiente = null;
    if (!idEstudiante && tokenUser?.id_usuario) {
      const acudiente = await Acudiente.findOne({
        where: { id_usuario: tokenUser.id_usuario },
        include: [{ model: Estudiante, as: 'estudiantes' }]
      });

      if (!acudiente) {
        return res.status(404).json({ error: 'Acudiente no encontrado para el usuario autenticado' });
      }

      const estudiantes = acudiente.estudiantes || [];
      if (estudiantes.length === 0) {
        return res.status(404).json({ error: 'No hay estudiantes asociados a este acudiente' });
      } else if (estudiantes.length === 1) {
        estudianteEncontradoDesdeAcudiente = estudiantes[0];
        idEstudiante = estudianteEncontradoDesdeAcudiente.id_estudiante;
      } else {
        // si hay varios estudiantes, pedimos al frontend que nos diga cuál usar
        return res.status(400).json({
          error: 'Múltiples estudiantes asociados: seleccione id_estudiante',
          estudiantes: estudiantes.map(s => ({ id_estudiante: s.id_estudiante, numero_documento: s.numero_documento }))
        });
      }
    }

    // Si aún no hay id_estudiante, fallamos con instrucción al cliente
    if (!idEstudiante) {
      return res.status(400).json({
        error: 'Falta id_estudiante (o numero_documento). Envíe id_estudiante en el body o asegúrese de estar autenticado como acudiente.'
      });
    }

    // Validar que el estudiante exista (defensivo)
    const estudianteFinal = estudianteEncontradoDesdeAcudiente || await Estudiante.findByPk(idEstudiante);
    if (!estudianteFinal) {
      return res.status(404).json({ error: 'Estudiante no encontrado' });
    }

    // Crear justificación (ajustado a la estructura de tu tabla)
    const nueva = await Justificacion.create({
      id_estudiante: idEstudiante,
      fecha: req.body.fecha,
      motivo: req.body.motivo,
      archivo: archivo.buffer
    });

    console.log('✅ Justificación creada con ID:', nueva.id_justificacion ?? nueva.id);
    return res.status(201).json(nueva);
  } catch (error) {
    console.error('❌ Error al crear justificación:', error);
    return res.status(500).json({ error: 'No se pudo crear la justificación', detalle: error.message });
  }
},

  // 📃 Listar todas las justificaciones
 async listarPorProfesor(req, res) {
  console.log('📋 [listarPorProfesor] Consultando justificaciones por profesor...');
  try {
    const tokenUser = req.usuario || req.user || null;
    if (!tokenUser?.id_usuario) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    // Buscar el funcionario (profesor) y sus grados asignados
    const profesor = await db.Funcionario.findOne({
      where: { id_usuario: tokenUser.id_usuario },
      include: [
        {
          model: db.FuncionarioGrado,
          as: 'gradosAsignados', // coincide con Funcionario.hasMany alias
          include: [
            {
              model: db.Grado,
              as: 'grado', // coincide con FuncionarioGrado.belongsTo alias
              include: [
                {
                  model: db.EstudianteGrado,
                  as: 'estudiantes', // coincide con Grado.hasMany alias
                  include: [
                    {
                      model: db.Estudiante,
                      as: 'estudiante', // coincide con EstudianteGrado.belongsTo alias
                      include: [
                        {
                          model: db.Persona,
                          as: 'persona'
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    if (!profesor) {
      return res.status(404).json({ error: 'Profesor no encontrado' });
    }

    // Obtener todos los id_estudiante desde la jerarquía
    const estudiantesIds = profesor.gradosAsignados.flatMap(fg =>
      fg.grado.estudiantes.map(eg => eg.id_estudiante)
    );

    if (estudiantesIds.length === 0) {
      return res.status(404).json({ error: 'No hay estudiantes asociados a este profesor' });
    }

    // Traer justificaciones de esos estudiantes
    const justificaciones = await db.Justificacion.findAll({
      where: { id_estudiante: estudiantesIds },
      include: [
        {
          model: db.Estudiante,
          as: 'estudiante',
          include: { model: db.Persona, as: 'persona', attributes: ['nombre', 'apellido'] }
        }
      ],
      order: [['fecha', 'DESC']]
    });

    console.log(`📊 Profesor tiene acceso a ${justificaciones.length} justificaciones`);
    res.json(justificaciones);
  } catch (error) {
    console.error('❌ Error al listar por profesor:', error);
    res.status(500).json({ error: 'Error al obtener las justificaciones', detalle: error.message });
  }
},
async descargarJustificacion(req, res) {
  console.log('📥 [descargarJustificacion] Solicitando descarga de justificación...');
  try {
    const { id } = req.params;
    const tokenUser = req.usuario || req.user || null;
    
    if (!tokenUser?.id_usuario) {
      console.log('❌ Usuario no autenticado');
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    console.log(`🔍 Buscando justificación ID: ${id}`);

    const justificacion = await db.Justificacion.findOne({
      where: { id_justificacion: id }
    });

    if (!justificacion) {
      console.log('❌ Justificación no encontrada');
      return res.status(404).json({ error: 'Justificación no encontrada' });
    }

    if (!justificacion.archivo) {
      console.log('❌ No hay archivo en la justificación');
      return res.status(404).json({ error: 'No hay archivo disponible' });
    }

    let archivoBuffer;
    
    if (justificacion.archivo.type === 'Buffer' && Array.isArray(justificacion.archivo.data)) {
      archivoBuffer = Buffer.from(justificacion.archivo.data);
    } else if (Buffer.isBuffer(justificacion.archivo)) {
      archivoBuffer = justificacion.archivo;
    } else {
      archivoBuffer = Buffer.from(justificacion.archivo);
    }

    console.log(`✅ Buffer preparado, tamaño: ${archivoBuffer.length} bytes`);

    if (archivoBuffer.length === 0) {
      return res.status(500).json({ error: 'El archivo está vacío' });
    }

    // Detectar el tipo de archivo basado en la firma
    const signature = archivoBuffer.slice(0, 4).toString('hex').toUpperCase();
    console.log('🔍 Firma del archivo (hex):', signature);

    let mimeType;
    let extension;

    // Mapeo de firmas a tipos MIME
    const firmas = {
      '25504446': { mime: 'application/pdf', ext: 'pdf' },      // PDF
      'FFD8FFE0': { mime: 'image/jpeg', ext: 'jpg' },           // JPEG
      'FFD8FFE1': { mime: 'image/jpeg', ext: 'jpg' },           // JPEG
      'FFD8FFE2': { mime: 'image/jpeg', ext: 'jpg' },           // JPEG
      'FFD8FFE3': { mime: 'image/jpeg', ext: 'jpg' },           // JPEG
      'FFD8FFE8': { mime: 'image/jpeg', ext: 'jpg' },           // JPEG
      '89504E47': { mime: 'image/png', ext: 'png' },            // PNG
      '47494638': { mime: 'image/gif', ext: 'gif' },            // GIF
      '504B0304': { mime: 'application/zip', ext: 'zip' },      // ZIP
      '504B0506': { mime: 'application/zip', ext: 'zip' },      // ZIP (empty archive)
      '504B0708': { mime: 'application/zip', ext: 'zip' },      // ZIP (spanned archive)
    };

    if (firmas[signature]) {
      mimeType = firmas[signature].mime;
      extension = firmas[signature].ext;
      console.log(`📄 Tipo detectado: ${mimeType} (${extension})`);
    } else {
      // Tipo desconocido, usar octet-stream
      mimeType = 'application/octet-stream';
      extension = 'bin';
      console.log(`❓ Tipo desconocido, usando: ${mimeType}`);
    }

    // Configurar headers según el tipo detectado
    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="justificacion_${id}.${extension}"`);
    res.setHeader('Content-Length', archivoBuffer.length);
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    console.log('📤 Enviando archivo...');
    res.send(archivoBuffer);

  } catch (error) {
    console.error('❌ Error crítico al descargar justificación:', error);
    
    if (res.headersSent) {
      console.log('⚠️  Headers ya enviados, cerrando conexión');
      return res.end();
    }
    
    res.status(500).json({ 
      error: 'Error interno del servidor',
      detalle: error.message
    });
  }
},
// Endpoint de prueba para ver el archivo en base64
async verArchivoBase64(req, res) {
  try {
    const { id } = req.params;
    const justificacion = await db.Justificacion.findByPk(id);
    
    if (!justificacion || !justificacion.archivo) {
      return res.status(404).json({ error: 'Archivo no encontrado' });
    }

    let archivoBuffer;
    if (justificacion.archivo.type === 'Buffer' && Array.isArray(justificacion.archivo.data)) {
      archivoBuffer = Buffer.from(justificacion.archivo.data);
    } else {
      archivoBuffer = justificacion.archivo;
    }

    res.json({
      id_justificacion: justificacion.id_justificacion,
      tamaño: archivoBuffer.length,
      base64: archivoBuffer.toString('base64').substring(0, 100) + '...',
      primerosBytes: Array.from(archivoBuffer.slice(0, 4))
    });
  } catch (error) {
    console.error('Error al ver archivo:', error);
    res.status(500).json({ error: error.message });
  }
},

  // 👨‍👧 Listar justificaciones del acudiente autenticado
  async listarPorAcudiente(req, res) {
    console.log('📋 [listarPorAcudiente] Consultando justificaciones del acudiente...');
    try {
      const tokenUser = req.usuario || req.user || null;
      if (!tokenUser?.id_usuario) {
        return res.status(401).json({ error: 'Usuario no autenticado' });
      }

      const acudiente = await Acudiente.findOne({
        where: { id_usuario: tokenUser.id_usuario },
        include: [{
          model: Estudiante,
          as: 'estudiantes'
        }]
      });

      if (!acudiente) {
        return res.status(404).json({ error: 'Acudiente no encontrado' });
      }

      const estudiantesIds = acudiente.estudiantes.map(e => e.id_estudiante);

      const justificaciones = await Justificacion.findAll({
        where: { id_estudiante: estudiantesIds },
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

      console.log(`📊 Acudiente tiene ${justificaciones.length} justificaciones`);
      res.json(justificaciones);
    } catch (error) {
      console.error('❌ Error al listar por acudiente:', error);
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
