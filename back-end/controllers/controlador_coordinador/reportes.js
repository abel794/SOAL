const db=require("../../models")
const { Sequelize } = require("sequelize");

const cors=require("cors")


const ObtenerUsuarios1=async(req,res)=>{
    try {
        console.log("obteniendo usuarios")
        const usuarios=await db.Usuario.findAll()
        res.json(usuarios)
    }catch(error){
        console.log("error al obtener usuarios",error)
        res.json({error:error.message})
    }
}
const obtenerArchivos = async (req, res) => {
  try {
    console.log("Obteniendo archivos con información de usuarios");

    const archivos = await db.Archivo.findAll({
      include: [
        {
          model: db.Usuario,
          attributes: ['id_usuario', 'username', 'numero_documento'],
          include: [
            {
              model: db.Persona,
              attributes: ['nombre', 'apellido', 'correo', 'numero_documento']
            }
          ]
        }
      ],
      order: [['fecha_subida', 'DESC']]
    });

    const archivosConBase64 = archivos.map((archivo) => {
      const buffer = archivo.contenido;
      const base64 = buffer ? buffer.toString("base64") : null;
      
      // Calcular tamaño del archivo
      const tamaño = buffer ? buffer.length : 0;

      return {
        id_archivo: archivo.id_archivo,
        nombre_original: archivo.nombre_original,
        nombre_sistema: archivo.nombre_sistema,
        tipo: archivo.tipo,
        tipo_documento: archivo.tipo_documento,
        contenido_base64: base64 ? `data:${archivo.tipo};base64,${base64}` : null,
        tamaño: tamaño,
        fecha_subida: archivo.fecha_subida,
        usuario: {
          id_usuario: archivo.Usuario?.id_usuario,
          username: archivo.Usuario?.username,
          persona: {
            nombre: archivo.Usuario?.Persona?.nombre,
            apellido: archivo.Usuario?.Persona?.apellido,
            correo: archivo.Usuario?.Persona?.correo,
            numero_documento: archivo.Usuario?.Persona?.numero_documento
          }
        }
      };
    });

    res.json(archivosConBase64);
  } catch (err) {
    console.error("Error al obtener archivos:", err);
    res.status(500).json({ error: err.message });
  }
};

// Controlador para descargar archivo individual
const descargarArchivo = async (req, res) => {
  try {
    const { id } = req.params;
    
    const archivo = await db.Archivo.findOne({
      where: { id_archivo: id },
      include: [
        {
          model: db.Usuario,
          include: [db.Persona]
        }
      ]
    });

    if (!archivo) {
      return res.status(404).json({ error: "Archivo no encontrado" });
    }

    // Configurar headers para descarga
    res.setHeader('Content-Type', archivo.tipo);
    res.setHeader('Content-Disposition', `attachment; filename="${archivo.nombre_original}"`);
    
    // Enviar el buffer directamente
    res.send(archivo.contenido);
  } catch (err) {
    console.error("Error al descargar archivo:", err);
    res.status(500).json({ error: err.message });
  }
};

const reportesAsistencia = async (req, res) => {
  try {
    console.log("🧾 Obteniendo reportes de asistencia...");

    const reportes = await db.Asistencia.findAll({
      attributes: [
        ["id_estudiante", "id_estudiante"],
        [Sequelize.fn("COUNT", Sequelize.col("Asistencia.id_estudiante")), "total_faltas"]
      ],
      where: { id_estado_asistencia: 2 }, // 2 = NO ASISTIÓ
      group: [
        "Asistencia.id_estudiante",
        "Estudiante.id_estudiante",
        "Estudiante.Persona.numero_documento"
      ],
      include: [
        {
          model: db.Estudiante,
          as: "Estudiante",
          attributes: ["id_estudiante", "numero_documento"], // 👈 cambiamos id_persona por numero_documento
          include: [
            {
              model: db.Persona,
              as: "Persona",
              attributes: ["numero_documento", "nombre", "apellido"] // 👈 aquí también se usa numero_documento
            }
          ]
        }
      ]
    });

    res.json(reportes);
  } catch (error) {
    console.error("❌ Error al obtener reportes de asistencia:", error);
    res.status(500).json({ error: error.message });
  }
};



module.exports = { 
  ObtenerUsuarios1, 
  obtenerArchivos, 
  descargarArchivo,
  reportesAsistencia 
};
