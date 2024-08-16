const express = require('express');
const { upload } = require('../helpers/multer.js');
const productosController = require('../Controllers/productosController.js');
const router = express.Router();

//middlewares
const checkAuth = require('../middlewares/checkAuth.js')
const checkRole = require('../middlewares/checkRole.js')

router.get('/', productosController.obtenerProductos);
router.post('/', checkAuth, checkRole(['administrador']), upload.single('Imagen'), productosController.crearProductos);
router.get('/:id', productosController.obtenerProductosPorId);
router.put('/:id', checkAuth, checkRole(['administrador']), productosController.actualizarProducto);
router.delete('/:id', checkAuth, checkRole(['administrador']), productosController.eliminarProducto);

module.exports = router;
