const express = require('express');
const { upload } = require('../helpers/multer.js');
const productosController = require('../Controllers/productosController.js');

const router = express.Router();

router.get('/', productosController.obtenerProductos);
router.post('/', upload.single('Imagen'), productosController.crearProductos);
router.get('/:id', productosController.obtenerProductosPorId);
// router.put('/:id', productosController.actualizarProducto);
router.delete('/:id', productosController.eliminarProducto);

module.exports = router;
