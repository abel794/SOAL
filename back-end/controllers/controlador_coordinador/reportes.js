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
const obtenerArchivo = async (req, res) => {
  try {
    console.log("obteniendo archivo");

    // Traes todos los registros
    const archivos = await db.Archivo.findAll();

    // Convertimos cada archivo a base64
    const archivosConBase64 = archivos.map((archivo) => {
      const buffer = archivo.contenido; // el campo BLOB
      const base64 = buffer ? buffer.toString("base64") : null;

      return {
        id_archivo: archivo.id_archivo,
        nombre_original: archivo.nombre_original,
        nombre_sistema: archivo.nombre_sistema,
        tipo: archivo.tipo,
        contenido_base64: base64 ? `data:${archivo.tipo};base64,${base64}` : null,
      };
    });

    // Enviamos ya todo convertido
    res.json(archivosConBase64);
  } catch (err) {
    console.log("error al obtener archivo");
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



module.exports={ ObtenerUsuarios1, obtenerArchivo, reportesAsistencia}