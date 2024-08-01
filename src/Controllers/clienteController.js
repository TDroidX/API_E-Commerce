const Cliente = require('../Models/clienteModel');
const bcrypt = require('bcrypt')

store = async (req, res) => {
    try {
        const { Usuario, Correo, Password, Telefono, ...rest } = req.body;
        
        const user = await Cliente.findOne({ where: { Usuario } });
        if (user) {
            return res.status(400).json({ error: 'Este nombre de usuario ya está en uso.' });
        }
        
        const email = await Cliente.findOne({ where: { Correo } });
        if (email) {
            return res.status(400).json({ error: 'El correo electrónico ya existe.' });
        }
        
        const telefono = await Cliente.findOne({ where: { Telefono } });
        if (telefono) {
            return res.status(400).json({ error: 'El número de telefono ya está en uso.' });
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(Password, salt);
        
        const clienteData = { Usuario, Correo, Password: hashedPassword, Telefono, ...rest };
        const cliente = await Cliente.create(clienteData);
        
        res.status(201).json(cliente);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

show = async (req, res) => {
    try {
        const clientes = await Cliente.findAll();
        res.status(200).json(clientes);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

find = async (req, res) => {
    try {
        const cliente = await Cliente.findByPk(req.params.id);
        if (cliente) {
            res.status(200).json(cliente);
        } else {
            res.status(404).json({ error: 'Cliente no encontrado.' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

update = async (req, res) => {
    try {
        const cliente = await Cliente.findByPk(req.params.id);
        if (!cliente) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }

        const { Email, Telefono, Usuario, Password, ...rest } = req.body;

        // Validar si el nuevo email ya está en uso
        if (Email && Email !== cliente.Email) {
            const existingEmail = await Cliente.findOne({ where: { Email } });
            if (existingEmail) {
                return res.status(400).json({ error: 'El correo electrónico ya está en uso' });
            }
        }

        // Validar si el nuevo teléfono ya está en uso
        if (Telefono && Telefono !== cliente.Telefono) {
            const existingTelefono = await Cliente.findOne({ where: { Telefono } });
            if (existingTelefono) {
                return res.status(400).json({ error: 'El teléfono ya está en uso' });
            }
        }

        // Validar si el nuevo usuario ya está en uso
        if (Usuario && Usuario !== cliente.Usuario) {
            const existingUsuario = await Cliente.findOne({ where: { Usuario } });
            if (existingUsuario) {
                return res.status(400).json({ error: 'El usuario ya está en uso' });
            }
        }

        // Si la nueva contraseña está presente en la solicitud, encriptarla
        if (Password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(Password, salt);
            rest.Password = hashedPassword;
        }

        await cliente.update({ Email, Telefono, Usuario, ...rest });

        res.status(200).json(cliente);
    } catch (error) {
        console.log(error);
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const validationErrors = error.errors.map(e => {
                // Personalizar los mensajes de error según el campo que causa el error
                if (e.path === 'Correo') {
                    return 'El correo electrónico ya está en uso';
                }
                if (e.path === 'Telefono') {
                    return 'El teléfono ya está en uso';
                }
                if (e.path === 'Usuario') {
                    return 'El usuario ya está en uso';
                }
                // Otros mensajes de error
                return e.message;
            });
            res.status(400).json({ error: validationErrors });
        } else {
            res.status(400).json({ error: error.message });
        }
    }
};

destroy = async (req, res) => {
    try {
        const cliente = await Cliente.findByPk(req.params.id);
        if (cliente) {
            await cliente.destroy();
            res.status(200).json({ message: 'El cliente ha sido eliminado.' });
        } else {
            res.status(404).json({ error: 'Cliente no encontrado.' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    show,
    find,
    store,
    update,
    destroy
}