const express = require('express');
const router = express.Router();

//Controllers
const clienteController = require('../Controllers/clienteController');

//middlewares
const checkAuth = require('../middlewares/checkAuth')
const checkRole = require('../middlewares/checkRole')

//Routes
// router.get('/create', clienteController.create)
router.post('/store', clienteController.store);
router.get('/show', clienteController.show);
router.get('/find/:id', clienteController.find);
// router.get('/edit/:id', clienteController.edit)
router.put('/update/:id', clienteController.update);
router.delete('/destroy/:id', clienteController.destroy);

module.exports = router;