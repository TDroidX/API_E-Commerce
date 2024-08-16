const express = require('express');
const comprasController = require('../Controllers/comprasController.js');

const router = express.Router();

// Obtener todas las compras (historial)
router.get('/', comprasController.obtenerCompras);

// Obtener una compra por ID
router.get('/:id', comprasController.obtenerCompraPorId);

module.exports = router;
