const express = require('express');
const router = express.Router();
const checkAuth = require('../middlewares/checkAuth')
const comprasController = require('../Controllers/comprasController');

// Ruta para obtener todas las compras de un usuario
router.get('/', checkAuth,comprasController.obtenerComprasPorUsuario);

// Ruta para obtener una compra específica de un usuario por IDCompra
router.get('/:id', checkAuth,comprasController.obtenerCompraPorUsuarioYID);

module.exports = router;
