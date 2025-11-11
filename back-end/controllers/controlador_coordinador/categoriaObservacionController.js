// Importamos el modelo y operador Sequelize
const db = require('../../models');
const CategoriaObservacion = db.CategoriaObservacion;
const GravedadObservacion = db.GravedadObservacion;
const Observacion = db.Observacion; // ⚡ Relación con Observación
const { Op } = require('sequelize');

const categoriaObservacionController = {
  // ✅ Obtener todas las categorías
  async obtenerTodas(req, res) {
    console.log("📌 [obtenerTodas] Iniciando petición...");
    try {
      const categorias = await CategoriaObservacion.findAll();
      console.log("✅ Categorías obtenidas:", categorias.map(c => c.nombre));

      res.json({
        total: categorias.length,
        categorias
      });
    } catch (error) {
      console.error("❌ Error en obtenerTodas:", error);
      res.status(500).json({ error: 'Error al obtener categorías' });
    }
  },

  // 🔍 Buscar por nombre con coincidencia parcial
  async buscarPorNombre(req, res) {
    const { nombre } = req.query;
    console.log("📌 [buscarPorNombre] Nombre recibido:", nombre);

    if (!nombre || nombre.trim() === '') {
      return res.status(400).json({ error: 'Debes proporcionar ?nombre=' });
    }

    try {
      const resultados = await CategoriaObservacion.findAll({
        where: {
          nombre: { [Op.like]: `%${nombre}%` }
        }
      });

      console.log("✅ Resultados encontrados:", resultados.length);

      res.json({
        total: resultados.length,
        resultados
      });
    } catch (error) {
      console.error("❌ Error en buscarPorNombre:", error);
      res.status(500).json({ error: 'Error al buscar por nombre' });
    }
  },

  // 🔢 Contar todas las categorías existentes
  async contarCategorias(req, res) {
    console.log("📌 [contarCategorias] Iniciando...");
    try {
      const total = await CategoriaObservacion.count();
      console.log("✅ Total categorías:", total);
      res.json({ total });
    } catch (error) {
      console.error("❌ Error en contarCategorias:", error);
      res.status(500).json({ error: 'Error al contar categorías' });
    }
  },

  // ✅ Obtener una categoría por ID
  async obtenerPorId(req, res) {
    const id = req.params.id;
    console.log("📌 [obtenerPorId] ID recibido:", id);

    try {
      const categoria = await CategoriaObservacion.findByPk(id);
      if (categoria) {
        console.log("✅ Categoría encontrada:", categoria.nombre);
        res.json(categoria);
      } else {
        console.warn("⚠️ Categoría no encontrada con ID:", id);
        res.status(404).json({ error: 'Categoría no encontrada' });
      }
    } catch (error) {
      console.error("❌ Error en obtenerPorId:", error);
      res.status(500).json({ error: 'Error al buscar categoría' });
    }
  },

  // ✅ Crear una nueva categoría
  async crear(req, res) {
    const { nombre } = req.body;
    console.log("📌 [crear] Datos recibidos:", req.body);

    if (!nombre || nombre.trim() === "") {
      console.warn("⚠️ Nombre vacío en crear()");
      return res.status(400).json({ error: 'El nombre de la categoría es obligatorio' });
    }

    try {
      const nueva = await CategoriaObservacion.create({ nombre });
      console.log("✅ Categoría creada:", nueva.toJSON());
      res.status(201).json(nueva);
    } catch (error) {
      console.error("❌ Error en crear:", error);
      res.status(400).json({ error: 'Error al crear la categoría', detalle: error.message });
    }
  },

  // ✅ Actualizar categoría
  async actualizar(req, res) {
    const id = req.params.id;
    const { nombre } = req.body;
    console.log("📌 [actualizar] ID:", id, "Nuevo nombre:", nombre);

    if (!nombre || nombre.trim() === "") {
      console.warn("⚠️ Nombre vacío en actualizar()");
      return res.status(400).json({ error: 'El nombre no puede estar vacío' });
    }

    try {
      const [filas] = await CategoriaObservacion.update(
        { nombre },
        { where: { id_categoria: id } }
      );

      if (filas === 0) {
        console.warn("⚠️ No se actualizó ninguna fila para ID:", id);
        res.status(404).json({ error: 'Categoría no encontrada o sin cambios' });
      } else {
        console.log("✅ Categoría actualizada ID:", id);
        res.json({ mensaje: 'Categoría actualizada correctamente' });
      }
    } catch (error) {
      console.error("❌ Error en actualizar:", error);
      res.status(400).json({ error: 'Error al actualizar la categoría', detalle: error.message });
    }
  },

  // ✅ Eliminar categoría
  async eliminar(req, res) {
    const id = req.params.id;
    console.log("📌 [eliminar] ID recibido:", id);

    try {
      const filas = await CategoriaObservacion.destroy({
        where: { id_categoria: id }
      });

      if (filas === 0) {
        console.warn("⚠️ No se eliminó ninguna categoría con ID:", id);
        res.status(404).json({ error: 'Categoría no encontrada' });
      } else {
        console.log("✅ Categoría eliminada ID:", id);
        res.json({ mensaje: 'Categoría eliminada correctamente' });
      }
    } catch (error) {
      console.error("❌ Error en eliminar:", error);
      res.status(500).json({ error: 'Error al eliminar la categoría' });
    }
  },

  // 📊 Contar observaciones por gravedad
async contarPorGravedad(req, res) {
  console.log("📌 [contarPorGravedad] Iniciando...");

  try {
    // Traer conteos por gravedad
    const resultados = await Observacion.findAll({
      attributes: [
        'id_gravedad',
        [db.sequelize.fn('COUNT', db.sequelize.col('id_gravedad')), 'cantidad']
      ],
      group: ['id_gravedad'],
      raw: true
    });

    console.log("✅ Resultados agrupados:", resultados);

    const total = resultados.reduce((sum, r) => sum + parseInt(r.cantidad), 0);

    // Obtener todas las gravedades
    const gravedades = await GravedadObservacion.findAll();

    // Crear un mapa de id_gravedad → nombre
    const gravedadMap = {};
    gravedades.forEach(g => {
      gravedadMap[g.id_gravedad] = g.nombre;
    });

    console.log("📌 Mapeo de gravedades:", gravedadMap);

    // Crear un mapa de conteos por id_gravedad
    const conteoMap = {};
    resultados.forEach(r => {
      conteoMap[r.id_gravedad] = parseInt(r.cantidad);
    });

    // Construir los porcentajes finales para todas las gravedades
    const porcentajes = {};
    gravedades.forEach(g => {
      const cantidad = conteoMap[g.id_gravedad] || 0;
      porcentajes[g.nombre] = ((cantidad / total) * 100).toFixed(1) + "%";
    });

    console.log("✅ Porcentajes finales:", porcentajes);

    res.json({ total, porcentajes });

  } catch (error) {
    console.error("❌ Error en contarPorGravedad:", error);
    res.status(500).json({ error: 'Error al contar observaciones por gravedad' });
  }
},

};

module.exports = categoriaObservacionController;
