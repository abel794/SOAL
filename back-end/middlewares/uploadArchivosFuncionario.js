const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 📁 Directorio temporal para guardar archivos subidos
const uploadDir = path.join(__dirname, '../uploads/tmp');

// 🛠️ Crear el directorio si no existe
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 🎯 Configuración del almacenamiento en disco
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

// 🎯 Lista de campos que esperas desde el frontend
const upload = multer({ storage }).fields([
  { name: 'archivo_eps', maxCount: 1 },
  { name: 'archivo_arl', maxCount: 1 },
  { name: 'archivo_hoja_vida', maxCount: 1 },
  { name: 'archivo_acta_grado', maxCount: 1 },
  { name: 'archivo_rut', maxCount: 1 }
]);

module.exports = upload;
