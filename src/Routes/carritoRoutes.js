const express = require('express');
const carritoController = require('../Controllers/carritoController.js');
const router = express.Router();

//middlewares
const checkAuth = require('../middlewares/checkAuth.js');

router.post('/', checkAuth, carritoController.andirCarrito);
router.get('/', checkAuth, carritoController.traerCarrito);
router.delete('/:id', checkAuth, carritoController.eliminarItem);

module.exports = router;