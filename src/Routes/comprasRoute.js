const express = require('express');
const router = express.Router();
const checkAuth = require('../middlewares/checkAuth')
const comprasController = require('../Controllers/comprasController');
const checkAuth = require('../middlewares/checkAuth');

// Ruta para obtener todas las compras de un usuario
router.get('/', checkAuth,comprasController.obtenerComprasPorUsuario);

// Ruta para obtener una compra específica de un usuario por IDCompra
router.get('/:id', checkAuth,comprasController.obtenerCompraPorUsuarioYID);

router.post('/pay', checkAuth, comprasController.crearSesionDePago);
router.get('/cancel', comprasController.cancel)

module.exports = router;
