const express = require('express');
const carritoController = require('../controllers/carritoController.js');

const router = express.Router();

router.post('/', carritoController.andirCarrito);
router.get('/', carritoController.traerCarrito);
router.delete('/:id', carritoController.eliminarItem);

module.exports = router;