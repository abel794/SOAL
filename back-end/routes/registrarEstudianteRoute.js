const express = require('express');
const router = express.Router();
const registrarEstudianteCompleto = require('../controllers/registroEstudianteController');
const upload = require('../middlewares/subidaArchivos'); // asegúrate que multer esté configurado ahí

router.post(
  '/',
  upload.fields([
    { name: 'foto', maxCount: 1 },
    { name: 'documento', maxCount: 1 }
  ]),
  registrarEstudianteCompleto.registrarTodo
);

module.exports = router;
