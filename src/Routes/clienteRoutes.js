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
router.get('/show', checkAuth, checkRole(['administrador']), clienteController.show);
router.get('/find/:id', checkAuth, checkRole(['administrador']), clienteController.find);
// router.get('/edit/:id', clienteController.edit)
router.put('/update/:id', checkAuth, clienteController.update);
router.delete('/destroy/:id', checkAuth, checkRole(['administrador']), clienteController.destroy);

router.get('/logs', checkAuth, checkRole(['administrador']), clienteController.logs);

module.exports = router;