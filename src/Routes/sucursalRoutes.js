const express = require('express');
const sucursalController = require('../Controllers/sucursalController.js');
const router = express.Router();

//middlewares
const checkAuth = require('../middlewares/checkAuth.js')
const checkRole = require('../middlewares/checkRole.js')

router.get('/', checkAuth, checkRole(['administrador']), sucursalController.obtenerSucursales);
router.post('/', checkAuth, checkRole(['administrador']), sucursalController.crearSucursal);
router.get('/:id', checkAuth, checkRole(['administrador']), sucursalController.obtenerSucursalPorId);
router.put('/:id', checkAuth, checkRole(['administrador']), sucursalController.actualizarSucursal);
router.delete('/:id', checkAuth, checkRole(['administrador']), sucursalController.eliminarSucursal);

module.exports = router;