const express = require('express');
const router = express.Router();
const registrarEstudianteCompleto = require('../../controllers/controlador_coordinador/registroEstudianteController');
const upload = require('../../middlewares/subidaArchivos'); // asegúrate que multer esté configurado ahí

router.post(
  '/',
  upload.fields([
    { name: 'fotoEstudiante', maxCount: 1 },
    { name: 'cedulaEstudiante', maxCount: 1 },
    { name: 'cedulaAcudiente', maxCount: 1 },
    { name: 'registroAnteriorColegio', maxCount: 1 },
    { name: 'certificadoEPS', maxCount: 1 },
    { name: 'reciboServicio', maxCount: 1 }
  ]),
  registrarEstudianteCompleto.registrarTodo
);
router.get('/buscarAcudiente', registrarEstudianteCompleto.buscarPorDocumento); // ruta para buscar acudiente por documento

module.exports = router;
