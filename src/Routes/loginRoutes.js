const express = require('express');
const router = express.Router();
const loginController = require('../Controllers/loginController');

//middlewares
const checkAuth = require('../middlewares/checkAuth');

router.post('/login', loginController.login);
router.get('/logout', checkAuth, loginController.logout);

module.exports = router;