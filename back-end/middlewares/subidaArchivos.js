// middlewares/subidaArchivos.js
const multer = require('multer');
const path = require('path');

// 🗂 Configuración del almacenamiento
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads'); // Guarda en la carpeta "uploads"
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  }
});

// 📎 Filtro opcional por tipo de archivo
const fileFilter = (req, file, cb) => {
  // Puedes validar extensiones si lo deseas, por ejemplo solo imágenes o PDFs
  const allowedTypes = /jpeg|jpg|png|pdf/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no permitido'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});

module.exports = upload;
