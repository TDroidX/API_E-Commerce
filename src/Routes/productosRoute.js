const express = require('express');
const productosController = require('../Controllers/productosController.js');

const router = express.Router();

router.get('/', productosController.obtenerProductos);
// router.post('/', productosController.crearProductos);
router.get('/:id', productosController.obtenerProductosPorId);
// router.put('/:id', productosController.actualizarProducto);
router.delete('/:id', productosController.eliminarProducto);

module.exports = router;
