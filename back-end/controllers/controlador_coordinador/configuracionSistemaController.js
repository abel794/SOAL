const db = require('../../models');
const { ConfiguracionSistema } = db;

const controlador = {
  // 🔍 Obtener configuración del sistema
  async obtener(req, res) {
    try {
      const config = await ConfiguracionSistema.findOne();
      if (!config) {
        return res.status(404).json({ error: '⚠️ No se encontró configuración del sistema' });
      }
      res.json(config);
    } catch (err) {
      console.error('❌ Error en obtener configuración:', err);
      res.status(500).json({ error: 'Error al obtener configuración del sistema' });
    }
  },

  // 🔄 Actualizar o crear configuración
  async actualizar(req, res) {
    try {
      console.log('🧾 req.body:', req.body);
      console.log('🖼️ req.file:', req.file);

      // 📥 Extraer campos del body
      const nombreColegio = req.body.nombreColegio?.trim();
      const direccion = req.body.direccion?.trim();
      const telefono = req.body.telefono?.trim() || null;
      const correo = req.body.correo?.trim() || null;
      const anioEscolar = parseInt(req.body.anioEscolar);
      const horaCierre = req.body.horaCierre?.trim();
      const activarAnio = req.body.activarAnio === 'true' || req.body.activarAnio === true;
      const notificacion = req.body.notificacion?.trim() || 'Correo';
      const horarioEnvio = req.body.horarioEnvio?.trim() || 'mañana';
      const notificarAcudiente = req.body.notificarAcudiente === 'true' || req.body.notificarAcudiente === true;
      const maxEstudiantesPorCurso = parseInt(req.body.maxEstudiantesPorCurso) || 30;
      const mensajeInstitucional = req.body.mensajeInstitucional?.trim() || '';

      // 🛑 Validar obligatorios
      if (!nombreColegio || !direccion || !anioEscolar || !horaCierre) {
        return res.status(400).json({
          error: '❌ Faltan campos obligatorios: nombreColegio, direccion, anioEscolar u horaCierre'
        });
      }

      // ⚙️ Buscar configuración
      let config = await ConfiguracionSistema.findOne({ where: { id_configuracion: 1 } });

      if (!config) {
        // Crear nueva configuración
        config = await ConfiguracionSistema.create({
          id_configuracion: 1,
          nombre_colegio: nombreColegio,
          direccion,
          telefono,
          correo,
          anio_escolar: anioEscolar,
          hora_cierre: horaCierre,
          activar_anio: activarAnio,
          medio_notificacion: notificacion,
          horario_envio: horarioEnvio,
          notificar_acudiente: notificarAcudiente,
          max_estudiantes_curso: maxEstudiantesPorCurso,
          mensaje_institucional: mensajeInstitucional,
          logo: req.file?.filename || null
        });
      } else {
        // Actualizar configuración existente
        await config.update({
          nombre_colegio: nombreColegio,
          direccion,
          telefono,
          correo,
          anio_escolar: anioEscolar,
          hora_cierre: horaCierre,
          activar_anio: activarAnio,
          medio_notificacion: notificacion,
          horario_envio: horarioEnvio,
          notificar_acudiente: notificarAcudiente,
          max_estudiantes_curso: maxEstudiantesPorCurso,
          mensaje_institucional: mensajeInstitucional,
          ...(req.file && { logo: req.file.filename })
        });
      }

      return res.json({
        mensaje: '✅ Configuración actualizada correctamente',
        config
      });
    } catch (err) {
      console.error('❌ Error al actualizar configuración:', err);
      return res.status(500).json({
        error: '❌ Error al actualizar configuración del sistema'
      });
    }
  }
};

module.exports = controlador;
