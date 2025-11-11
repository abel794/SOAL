// routes/coordinador/canal_notificacion_coordinador.js
const express = require('express');
const router = express.Router();

// 📌 Importamos el controlador correspondiente
const canalController = require('../../controllers/controlador_coordinador/canalNotificacionController');

// ✅ Obtener todos los canales
router.get('/', canalController.obtenerTodos);

// ✅ Obtener un canal por ID
router.get('/:id', canalController.obtenerPorId);

// ✅ Crear un nuevo canal
router.post('/', canalController.crear);

// ✅ Actualizar un canal existente
router.put('/:id', canalController.actualizar);

// ✅ Eliminar un canal
router.delete('/:id', canalController.eliminar);

module.exports = router;
