// controllers/observacionController.js

const db = require('../../models');
const {
  Observacion,
  Estudiante,
  Funcionario,
  CategoriaObservacion,
  GravedadObservacion,
  HistorialObservacion,
  Notificacion,
  Acudiente,
  Persona
} = db;
const { Op } = require('sequelize');
const { enviarCorreo } = require("../../services/emailService");

const observacionController = {

  // Obtener observaciones del acudiente con sus estudiantes
  
  // Contar observaciones por categoría con porcentaje
  async contarPorCategoriaConPorcentaje(req, res) {
    console.log('🚀 [contarPorCategoriaConPorcentaje] Inicio');
    try {
      const total = await Observacion.count();
//      console.log('ℹ️ [contarPorCategoriaConPorcentaje] Total observaciones =', total);

      if (total === 0) {
  //      console.warn('⚠️ [contarPorCategoriaConPorcentaje] No hay observaciones registradas');
        return res.json({ mensaje: 'No hay observaciones registradas', porcentajes: {} });
      }

      const categorias = await CategoriaObservacion.findAll();
      const porcentajes = {};

      for (const categoria of categorias) {
        const cantidad = await Observacion.count({
          where: { id_categoria: categoria.id_categoria }
        });
        porcentajes[categoria.nombre] = ((cantidad / total) * 100).toFixed(1) + '%';
        console.log(`   • ${categoria.nombre}: ${cantidad}/${total} → ${porcentajes[categoria.nombre]}`);
      }

    //  console.log('✅ [contarPorCategoriaConPorcentaje] Resultado:', porcentajes);
      return res.json({ total, porcentajes });

    } catch (error) {
      console.error('❌ [contarPorCategoriaConPorcentaje] Error:', error);
      return res.status(500).json({
        error: 'Error al calcular porcentajes por categoría',
        detalle: error.message
      });
    }
  },

  // Crear observación + notificación automática con transacción
  // Crear observación + notificación automática con validación de rol
async crear(req, res) {
  const t = await db.sequelize.transaction();
  try {
    console.log("🔒 [crear] Inicio de función, extrayendo usuario del token...");
    const { id_funcionario, rol } = req.usuario || {};
    console.log("🔒 [crear] Usuario extraído:", { id_funcionario, rol });

    if (!id_funcionario || !rol) {
      console.warn("⚠️ [crear] Usuario no identificado correctamente.");
      await t.rollback();
      return res.status(401).json({ error: "No se pudo identificar al funcionario. Inicia sesión nuevamente." });
    }

    const ROLES_AUTORIZADOS = ["profesor", "secretaria", "coordinador", "rector", "psicologo"];
    console.log("🎯 [crear] Validando rol autorizado...");
    if (!ROLES_AUTORIZADOS.includes(rol.toLowerCase())) {
      console.warn("⛔ [crear] Rol no autorizado:", rol);
      await t.rollback();
      return res.status(403).json({ error: "No tienes permiso para registrar observaciones." });
    }

    console.log("📋 [crear] Buscando funcionario en BD...");
    const funcionario = await Funcionario.findByPk(id_funcionario);
    console.log("📋 [crear] Funcionario encontrado:", funcionario?.id_funcionario || "No encontrado");
    if (!funcionario) {
      await t.rollback();
      return res.status(404).json({ error: "Funcionario no encontrado en la base de datos." });
    }

    console.log("🧱 [crear] Creando observación con datos:", req.body);
    const nueva = await Observacion.create(
      { 
        ...req.body, 
        id_funcionario 
      },
      { transaction: t }
    );
    console.log("🧱 [crear] Observación creada:", nueva?.id_observacion);

    console.log("📚 [crear] Buscando estudiante y acudientes...");
    const estudiante = await Estudiante.findByPk(req.body.id_estudiante, {
      include: [{ model: Acudiente, as: "acudientes", through: { attributes: [] } }],
      transaction: t
    });

    if (!estudiante || !estudiante.acudientes.length) {
      console.warn("⚠️ [crear] Estudiante sin acudiente.");
      await t.rollback();
      return res.status(404).json({ error: "No se encontró acudiente asociado al estudiante." });
    }

    console.log("📚 [crear] Estudiante encontrado:", estudiante?.id_estudiante);
    console.log("📚 [crear] Acudientes asociados:", estudiante?.acudientes?.length);

    // 🔔 Crear notificaciones y enviar correos a todos los acudientes
    for (const acudiente of estudiante.acudientes) {
      console.log("📢 [crear] Creando notificación para acudiente:", acudiente.id_acudiente);
      const noti = await Notificacion.create({
        id_observacion: nueva.id_observacion,
        id_acudiente: acudiente.id_acudiente,
        mensaje: "Se ha registrado una observación para su acudido. Por favor, revísela.",
        id_canal: 1,
        id_estado_notificacion: 1
      }, { transaction: t });

      console.log("📢 [crear] Notificación creada:", noti?.id_notificacion);

      const personaAcudiente = await Persona.findOne({
        where: { numero_documento: acudiente.numero_documento },
        transaction: t
      });

      if (personaAcudiente?.correo) {
        console.log("📨 [crear] Enviando correo a:", personaAcudiente.correo);
        enviarCorreo(
          personaAcudiente.correo,
          "Nueva observación registrada",
          `Se ha registrado una observación para su acudido ${estudiante.persona?.nombre || ""}.`
        );
      }
    }

    await t.commit();
    console.log("✅ [crear] Transacción completada exitosamente.");
    return res.status(201).json(nueva);

  } catch (error) {
    await t.rollback();
    console.error("❌ [crear] Error y rollback:", error);
    return res.status(500).json({ error: "Error al crear observación", detalle: error.message });
  }
}

,

  // Listar observaciones con detalles y alias claros
  async listarConDetalles(req, res) {
  //  console.log('🚀 [listarConDetalles] Inicio');
    try {
      const observaciones = await Observacion.findAll({
        include: [
          {
            model: Estudiante,
            as: 'estudiante',
            include: [
              { model: Persona, as: 'persona' },
              { model: Acudiente, as: 'acudientes' }
            ]
          },
          { model: Funcionario, as: 'funcionario', include: [{ model: Persona, as: 'persona' }] },
          { model: CategoriaObservacion, as: 'categoria' },
          { model: GravedadObservacion, as: 'gravedad' }
        ]
      });
      console.log(`✅ [listarConDetalles] Encontradas ${observaciones.length} observaciones`);

      const resultado = observaciones.map(obs => ({
        estudiante: obs.estudiante?.persona?.nombre || 'No disponible',
        acudientes: obs.estudiante?.acudientes?.map(a => a.nombre) || [],
        tipo: obs.categoria?.nombre_categoria || 'No disponible',
        profesor: obs.funcionario?.persona?.nombre || 'No disponible',
        fecha: obs.fecha,
        gravedad: obs.gravedad?.nombre || 'No disponible',
        observacion: obs.descripcion
      }));
    //  console.log('📤 [listarConDetalles] Respuesta:', resultado);

      return res.json(resultado);

    } catch (error) {
      console.error('❌ [listarConDetalles] Error:', error);
      return res.status(500).json({ error: 'Error al listar observaciones', detalle: error.message });
    }
  },

  // Actualizar observación y registrar en historial
  async actualizar(req, res) {
  //  console.log('🚀 [actualizar] Inicio para id =', req.params.id);
    const id = req.params.id;
    const { descripcion_modificacion, ...datosActualizados } = req.body;

    try {
    //  console.log('🔍 [actualizar] Datos a actualizar:', datosActualizados);
      const [updatedCount] = await Observacion.update(datosActualizados, {
        where: { id_observacion: id }
      });

      if (updatedCount === 0) {
   //     console.warn('⚠️ [actualizar] Ninguna fila actualizada para id_observacion =', id);
        return res.status(404).json({ error: 'Observación no encontrada o sin cambios' });
      }

    //  console.log('✅ [actualizar] Observación actualizada, creando historial');
      await HistorialObservacion.create({
        id_observacion: id,
        descripcion_modificacion: descripcion_modificacion || 'Modificación en observación',
        fecha_modificacion: new Date()
      });

    //  console.log('📤 [actualizar] Historial registrado');
      return res.json({ mensaje: 'Observación actualizada y registrada en el historial' });

    } catch (error) {
      console.error('❌ [actualizar] Error:', error);
      return res.status(400).json({ error: 'Error al actualizar', detalle: error.message });
    }
  },

  // Eliminar observación
  async eliminar(req, res) {
  //  console.log('🚀 [eliminar] Inicio para id =', req.params.id);
    try {
      const deletedCount = await Observacion.destroy({ where: { id_observacion: req.params.id } });
      if (!deletedCount) {
   //     console.warn('⚠️ [eliminar] No se pudo borrar id =', req.params.id);
        return res.status(404).json({ error: 'Observación no encontrada' });
      }
      console.log('✅ [eliminar] Observación eliminada id =', req.params.id);
      return res.json({ mensaje: 'Observación eliminada correctamente' });

    } catch (error) {
      console.error('❌ [eliminar] Error:', error);
      return res.status(500).json({ error: 'Error al eliminar', detalle: error.message });
    }
  },

  // Contar total de observaciones
  async contarObservaciones(req, res) {
    try {
      // Conteo total
      const total = await Observacion.count();

      // Traer todas las observaciones con fecha y descripción
      const observaciones = await Observacion.findAll({
        attributes: ['id_observacion', 'fecha', 'descripcion'],
        order: [['fecha', 'DESC']] // opcional: ordena por fecha
      });

      return res.json({ totalObservaciones: total, observaciones });
    } catch (error) {
      console.error('❌ [contarObservaciones] Error:', error);
      return res.status(500).json({ error: 'Error al obtener observaciones', detalle: error.message });
    }
  },

  // Contar observaciones por gravedad con porcentaje
  // contarPorGravedad: cuenta observaciones por gravedad, normaliza nombres y devuelve
// total + detalle (cantidad y porcentaje) por cada gravedad conocida. Agrupa lo desconocido en "Otros".
async contarPorGravedad(req, res) {
//  console.log('🚀 [contarPorGravedad] Inicio');

  try {
    // 1) Total de observaciones
    const total = await Observacion.count();
  //  console.log('ℹ️ [contarPorGravedad] Total observaciones =', total);

    // 2) Estructura inicial para el resultado (canonical keys capitalized)
    // Usamos este orden/forma para la salida final: 'Leve', 'Moderada', 'Grave'
    const resumen = {
      Leve: { cantidad: 0, porcentaje: '0.0%' },
      Moderada: { cantidad: 0, porcentaje: '0.0%' },
      Grave: { cantidad: 0, porcentaje: '0.0%' },
      Otros: [] // aquí guardamos gravedades no esperadas
    };

    // Si no hay observaciones, devolvemos 0s
    if (total === 0) {
    //  console.warn('⚠️ [contarPorGravedad] Sin observaciones');
      return res.json({ total, resumen });
    }

    // 3) Función utilitaria para normalizar nombres:
    //    - quita tildes/diacríticos
    //    - trim
    //    - a minúsculas
    const normalizar = (str = '') =>
      String(str)
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
        .toLowerCase();

    // 4) Diccionario de alias -> canonicalLower
    //    Acepta variantes como "moderado", "moderada", "MODERADA ", etc.
    const alias = {
      'leve': 'Leve',
      'leves': 'Leve',
      'moderado': 'Moderada',
      'moderada': 'Moderada',
      'moderados': 'Moderada',
      'moderadas': 'Moderada',
      'grave': 'Grave',
      'graves': 'Grave'
      // añade más equivalencias si en BD hay otras formas
    };

    // 5) Obtenemos todas las gravedades registradas (id + nombre)
    const gravedades = await GravedadObservacion.findAll();

    // 6) Recorremos las gravedades, contamos y asignamos al resumen correcto
    for (const g of gravedades) {
      const idGravedad = g.id_gravedad ?? g.get('id_gravedad'); // por seguridad
      const nombreOriginal = (g.get && typeof g.get === 'function') ? g.get('nombre') : g.nombre;
      const nombreNorm = normalizar(nombreOriginal);

      // Contamos cuántas observaciones tiene esta gravedad (por id)
      const cantidad = await Observacion.count({ where: { id_gravedad: idGravedad } });

      // Mapeo mediante alias
      const claveCanonical = alias[nombreNorm]; // p. ej. 'Leve' o 'Moderada' o 'Grave' o undefined

      if (claveCanonical && resumen.hasOwnProperty(claveCanonical)) {
        // Actualizamos cantidad en la clave correspondiente
        resumen[claveCanonical].cantidad = cantidad;
        console.log(`   • ${nombreOriginal} → ${claveCanonical}: ${cantidad}/${total}`);
      } else {
        // Si es un nombre inesperado lo guardamos en 'Otros' (con nombre original y cantidad)
      //  console.warn(`⚠️ [contarPorGravedad] Ignorada / desconocida gravedad: "${nombreOriginal}" (normalizada: "${nombreNorm}")`);
        // Si ya existe en Otros con mismo nombre, sumar la cantidad (evita duplicados)
        const idx = resumen.Otros.findIndex(o => normalizar(o.nombre) === nombreNorm);
        if (idx >= 0) {
          resumen.Otros[idx].cantidad += cantidad;
        } else {
          resumen.Otros.push({ nombre: nombreOriginal, cantidad });
        }
      }
    }

    // 7) Calcular porcentajes para claves conocidas
    for (const key of ['Leve', 'Moderada', 'Grave']) {
      const cnt = resumen[key].cantidad || 0;
      resumen[key].porcentaje = ((cnt / total) * 100).toFixed(1) + '%';
    }

    // 8) Calcular porcentajes para 'Otros' (si hay) y formatearlos
    if (resumen.Otros.length > 0) {
      resumen.Otros = resumen.Otros.map(o => ({
        nombre: o.nombre,
        cantidad: o.cantidad,
        porcentaje: ((o.cantidad / total) * 100).toFixed(1) + '%'
      }));
    }

    // 9) Log y respuesta final
  //  console.log('✅ [contarPorGravedad] Resultado:', resumen);
    return res.json({ total, resumen });

  } catch (error) {
    // Manejo de errores
    console.error('❌ [contarPorGravedad] Error:', error);
    return res.status(500).json({ error: 'Error al contar por gravedad', detalle: error.message });
  }
},

  // Contar por tipo de observación (cantidad simple)
  async contarPorTipo(req, res) {
  //  console.log('🚀 [contarPorTipo] Inicio');
    try {
      const categorias = await CategoriaObservacion.findAll();
      const resultados = {};
      console.log('ℹ️ [contarPorTipo] Categorías encontradas =', categorias.length);

      for (const cat of categorias) {
        const cantidad = await Observacion.count({ where: { id_categoria: cat.id_categoria } });
        resultados[cat.nombre_categoria] = cantidad;
        console.log(`   • ${cat.nombre_categoria}: ${cantidad}`);
      }

    //  console.log('✅ [contarPorTipo] Resultado:', resultados);
      return res.json(resultados);

    } catch (error) {
      console.error('❌ [contarPorTipo] Error:', error);
      return res.status(500).json({ error: 'Error al contar por tipo', detalle: error.message });
    }
  },

  // Contar observaciones críticas (Disciplina + Crítica)
  // Contar observaciones con gravedad Crítica, Grave o Urgente
async contarObservacionesSerias(req, res) {
  console.log('🚀 [contarObservacionesSerias] Inicio')
  try {
    // Buscar las gravedades que queremos contar
    const gravedades = await GravedadObservacion.findAll({
      where: {
        nombre: ['Crítica', 'Grave', 'Urgente'] // array de nombres
      }
    });

    if (!gravedades.length) return res.status(404).json({ error: 'No se encontraron gravedades relevantes' });

    const gravedadesIds = gravedades.map(g => g.id_gravedad);

    // Contar observaciones
    const total = await Observacion.count({
      where: {
        id_gravedad: gravedadesIds
      }
    });

    console.log('✅ [contarObservacionesSerias] Total de observaciones serias:', total);
    console.log('Gravedades encontradas:', gravedades.map(g => g.nombre, g => g.id_gravedad));

    return res.json({ observacionesSerias: total });

  } catch (error) {
    return res.status(500).json({ error: 'Error al contar observaciones serias', detalle: error.message });
  }
},

// Listar observaciones con gravedad Crítica, Grave o Urgente
async listarObservacionesSerias(req, res) {
  console.log('🚀 [listarObservacionesSerias] Inicio');
  try {
    const gravedades = await GravedadObservacion.findAll({
      where: {
        nombre: ['Crítica', 'Grave', 'Urgente']
      }
    });

    if (!gravedades.length) return res.json([]);

    const gravedadesIds = gravedades.map(g => g.id_gravedad);

    const casos = await Observacion.findAll({
      where: {
        id_gravedad: gravedadesIds
      },
      include: [
        { model: Estudiante, as: 'estudiante', include: ['persona'] },
        { model: GravedadObservacion, as: 'gravedad' }
      ]
    });

    const resultado = casos.map(c => ({
      estudiante: c.estudiante?.persona?.nombre || 'No disponible',
      fecha: c.fecha,
      gravedad: c.gravedad?.nombre || 'No disponible',
      observacion: c.descripcion
    }));

    console.log('✅ [listarObservacionesSerias] Resultado:', resultado);
    console.log('Gravedades encontradas:', gravedades.map(g => g.nombre, g => g.id_gravedad));

    return res.json(resultado);

  } catch (error) {
    return res.status(500).json({ error: 'Error al listar observaciones serias', detalle: error.message });
  }
},


}

module.exports = observacionController;
