const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const Cliente = require('../Models/clienteModel')
require('dotenv').config()

const login = async (req, res) => {
    const { usuario, password } = req.body;

    try {
        let username = await Cliente.findOne({ usuario});
        if (!username) {
            return res.status(400).send('Usuario no existente');
        }

        const isMatch = await bcrypt.compare(password, username.Password);
        if (!isMatch) {
            return res.status(400).send('Contraseña incorrecta');
        }

        const token = jwt.sign({ id: username.IDCliente, rol: username.Rol, usuario: username.Usuario }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true });

        res.status(200).send('Inicio de sesión exitoso');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
};

const logout = (req, res) => {
    res.cookie('token', '', { expires: new Date(0) });
    res.send('Sesion finalizada')
};

module.exports={login, logout}
