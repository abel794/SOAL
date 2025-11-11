const express = require('express');
const router = express.Router();
const controller = require('../../controllers/controlador_coordinador/nivelEscolaridadController');

// 🔍 Buscar por nombre (debe ir antes de rutas con :id)
router.get('/buscar', controller.buscarPorNombre);

// 📊 Contar funcionarios por nivel
router.get('/contar/funcionarios', controller.contarFuncionarios);

// 📋 Obtener todos los niveles (con funcionarios)
router.get('/', controller.listar);

// ➕ Crear nuevo nivel
router.post('/', controller.crear);

// ✏️ Actualizar nivel por ID
router.put('/:id', controller.actualizar);

// 🗑️ Eliminar nivel por ID
router.delete('/:id', controller.eliminar);

module.exports = router;
