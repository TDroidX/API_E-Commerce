const express = require('express');
const router = express.Router();
const comprasController = require('../Controllers/comprasController');

// Ruta para obtener todas las compras de un usuario
router.get('/', comprasController.obtenerComprasPorUsuario);

// Ruta para obtener una compra específica de un usuario por IDCompra
router.get('/:id', comprasController.obtenerCompraPorUsuarioYID);

module.exports = router;
