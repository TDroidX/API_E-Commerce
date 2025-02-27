const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const Cliente = require('../Models/clienteModel')
const logger = require('../helpers/logger')
require('dotenv').config()

const login = async (req, res) => {
    const { usuario, password } = req.body;

    try {
        // Busca al cliente por su nombre de usuario
        const cliente = await Cliente.findOne({ where: { Usuario: usuario } });

        if (!cliente) {
            return res.status(400).send('Usuario no existente');
        }

        // Compara la contraseña proporcionada con la almacenada en la base de datos
        const isMatch = await bcrypt.compare(password, cliente.Password);

        if (!isMatch) {
            console.log("resultado", isMatch);
            return res.status(400).send('Contraseña incorrecta');
        }

        // Genera el token JWT
        const token = jwt.sign({ id: cliente.IDCliente, rol: cliente.Rol, usuario: cliente.Usuario }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Envía el token como una cookie
        res.cookie('token', token, { httpOnly: true });

        // Registra el inicio de sesión
        logger.info({ usuario: cliente.Usuario, rol: cliente.Rol }, 'El usuario ' + cliente.Usuario + ' inició sesión');

        res.status(200).send('Inicio de sesión exitoso');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
};

const logout = (req, res) => {
    const usuario = req.usuario;
    const rol = req.rol;

    logger.info({ usuario: usuario, rol: rol }, 'El usuario '+usuario+' cerró sesión')

    res.cookie('token', '', { expires: new Date(0) });
    res.send('Sesion finalizada')
};

module.exports={login, logout}
