// routes/acudiente_coordinador.js
const express = require('express');
const router = express.Router();
const acudienteController = require('../../controllers/controlador_coordinador/acudienteController');
const { verificarToken, verificarRol } = require('../../middlewares/authMiddleware');

// ✅ Todas las rutas requieren autenticación y rol Coordinador
router.use(verificarToken, verificarRol(['Coordinador']));

// 📌 Obtener todos los acudientes con relaciones
router.get('/', acudienteController.obtenerTodos);

// 📌 Obtener un acudiente por ID
router.get('/:id', acudienteController.obtenerPorId);

// 📌 Crear nuevo acudiente
router.post('/', acudienteController.crear);

// 📌 Actualizar acudiente por ID
router.put('/:id', acudienteController.actualizar);

// 📌 Eliminar acudiente por ID
router.delete('/:id', acudienteController.eliminar);

// 📌 Obtener estudiantes asignados a un acudiente
router.get('/:id/estudiantes', acudienteController.estudiantesDeAcudiente);

// 📌 Buscar acudiente por nombre
router.get('/buscar/nombre', acudienteController.buscarPorNombre);

module.exports = router;
