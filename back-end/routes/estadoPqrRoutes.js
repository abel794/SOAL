const express = require('express');
const router = express.Router();
const estadoPqrController = require('../controllers/estadoPqrController');

// Crear nuevo estado PQR
router.post('/', estadoPqrController.crear);

// Obtener todos los estados PQR
router.get('/', estadoPqrController.obtenerTodos);

// Buscar por nombre (?nombre=)
router.get('/buscar', estadoPqrController.buscarPorNombre);

// Contar total de estados PQR
router.get('/contar/total', estadoPqrController.contar);

// Obtener un estado PQR por ID
router.get('/:id', estadoPqrController.obtenerPorId);

// Actualizar un estado PQR por ID
router.put('/:id', estadoPqrController.actualizar);

// Eliminar un estado PQR por ID
router.delete('/:id', estadoPqrController.eliminar);

module.exports = router;
