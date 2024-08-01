const express = require('express');
const sucursalController = require('../controllers/sucursalController.js');

const router = express.Router();

router.get('/', sucursalController.obtenerSucursales);
router.post('/', sucursalController.crearSucursal);
router.get('/:id', sucursalController.obtenerSucursalPorId);
router.put('/:id', sucursalController.actualizarSucursal);
router.delete('/:id', sucursalController.eliminarSucursal);

module.exports = router;