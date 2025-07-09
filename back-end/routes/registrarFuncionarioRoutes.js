// 📁 routes/registroFuncionario.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const registrarFuncionarioCompleto = require('../controllers/registrarFuncionario');

// 📂 Configuración de multer para almacenamiento temporal en carpeta 'uploads'
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Carpeta donde se guardan los archivos temporalmente
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// ✅ Ruta POST para registrar funcionario con múltiples archivos
router.post(
  '/',
  upload.fields([
    { name: 'archivo_eps', maxCount: 1 },
    { name: 'archivo_arl', maxCount: 1 },
    { name: 'archivo_hoja_vida', maxCount: 1 },
    { name: 'archivo_acta_grado', maxCount: 1 },
    { name: 'archivo_rut', maxCount: 1 }
  ]),
  registrarFuncionarioCompleto.registrarTodo
);

module.exports = router;
