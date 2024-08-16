const connection = require('../conectionDB.js');
const Sucursal = require('../models/sucursalModel.js');
const message = require('../utils/messages.js');
const { Op } = require('sequelize');
const {messageGeneral} = message;
const logger = require('../helpers/logger.js')

const valNombre = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{5,50}$/;
const valCalle = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{5,50}$/;
const valNumero = /^[0-9]{1,4}$/;
const valColonia = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{5,50}$/;
const valLocalidad = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{5,50}$/;
const valMunicipio = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{5,50}$/;
const valCP = /^[0-9]{5}$/;
const valTelefono = /^[0-9]{10}$/;
const valTipo = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{6,8}$/;

// Obtener todas las sucursales
exports.obtenerSucursales = async (req, res) => {
    try {
        const sucursales = await Sucursal.findAll();
        res.json(sucursales);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las sucursales' });
    }
};

// Crear una nueva sucursal
exports.crearSucursal = async (req, res) => {
    const usuario = req.usuario;
    const rol = req.rol;
    try {
        const data = req.body;

        const allowedFields = ['Nombre', 'Calle', 'Numero', 'Colonia', 'Localidad', 'Municipio', 'CP', 'Telefono', 'Tipo'];

        const invalidFields = Object.keys(data).filter(field => !allowedFields.includes(field));
        if (invalidFields.length > 0) {
        return messageGeneral(res, 400, false, "", `Campos no permitidos: ${invalidFields.join(', ')}`);
        }

        for (const field of allowedFields) {
        if (!data[field]) {
            return messageGeneral(res, 400, false, "", `El campo ${field} no puede estar vacío.`);
        }
        }

        if (!valNombre.test(data.Nombre)) {
            return messageGeneral(res, 400, false, "", "El campo Nombre es inválido, debe contener entre 5 y 50 letras, sin números o caracteres especiales .");
        }
        
        if (!valCalle.test(data.Nombre)) {
            return messageGeneral(res, 400, false, "", "El campo Calle es inválido, debe contener entre 5 y 50 letras, sin números o caracteres especiales .");
        }

        if (!valNumero.test(data.Numero)) { 
            return messageGeneral(res, 400, false, "", "El campo Númeroes inválido, debe ser numérico y tener entre 1 y 4 dígitos.");
        }

        if (!valColonia.test(data.Colonia)) {
            return messageGeneral(res, 400, false, "", "El campo Colonia es inválido, debe contener entre 5 y 50 letras, sin números o caracteres especiales .");
        }

        if (!valLocalidad.test(data.Colonia)) {
            return messageGeneral(res, 400, false, "", "El campo Localidad es inválido, debe contener entre 5 y 50 letras, sin números o caracteres especiales .");
        }

        if (!valMunicipio.test(data.Municipio)) {
            return messageGeneral(res, 400, false, "", "El campo Municipio es inválido, debe contener entre 5 y 50 letras, sin números o caracteres especiales.");
        }

        if (!valCP.test(data.CP)) {
            return messageGeneral(res, 400, false, "", "El campo Código postal es inválido, debe ser numérico y tener exactamente 5 dígitos.");
        }

        if (!valTelefono.test(data.Telefono)) {o
            return messageGeneral(res, 400, false, "", "El número de teléfono es inválido, debe ser numérico y tener exactamente 10 dígitos.");
        }

        const telefonoExistente = await Sucursal.findOne({ where: { Telefono: data.Telefono } });
        if (telefonoExistente) {
            return messageGeneral(res, 400, false, "", "El número de teléfono ya existe.");
        }

        if (!valTipo.test(data.Tipo)) {
            return messageGeneral(res, 400, false, "", "El campo Tipo es inválido, debe contener entre 6 y 8 letras, sin números o caracteres especiales.");
        }

        const nuevaSucursal = await Sucursal.create({
            Nombre: req.body.Nombre,
            Calle: req.body.Calle,
            Numero: req.body.Numero,
            Colonia: req.body.Colonia,
            Localidad: req.body.Localidad,
            Municipio: req.body.Municipio,
            CP: req.body.CP,
            Telefono: req.body.Telefono,
            Tipo: req.body.Tipo
        });

        logger.info({ usuario: usuario, rol: rol }, 'Se registró la sucursal '+req.body.Nombre)

        res.status(201).json(nuevaSucursal);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al crear la sucursal' });
    }
};

// Obtener una sucursal por ID
exports.obtenerSucursalPorId = async (req, res) => {
    try {
        const sucursal = await Sucursal.findByPk(req.params.id);
        if (sucursal) {
            res.json(sucursal);
        } else {
            res.status(404).json({ error: 'Sucursal no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener la sucursal' });
    }
};

// Actualizar una sucursal
exports.actualizarSucursal = async (req, res) => {
    const usuario = req.usuario;
    const rol = req.rol;
    try {

        const data = req.body;
        const sucursalExistente = await Sucursal.findByPk(req.params.id);

        if (sucursalExistente) {
    
        const allowedFields = ['Nombre', 'Calle', 'Numero', 'Colonia', 'Localidad', 'Municipio', 'CP', 'Telefono', 'Tipo'];

        const invalidFields = Object.keys(data).filter(field => !allowedFields.includes(field));
        if (invalidFields.length > 0) {
            return messageGeneral(res, 400, false, "", `Campos no permitidos: ${invalidFields.join(', ')}`);
        }

        for (const field of allowedFields) {
            if (!data[field]) {
                return messageGeneral(res, 400, false, "", `El campo ${field} no puede estar vacío.`);
            }
        }

        if (!valNombre.test(data.Nombre)) {
            return messageGeneral(res, 400, false, "", "El campo Nombre es inválido, debe contener entre 5 y 50 letras, sin números o caracteres especiales.");
        }

        if (!valCalle.test(data.Calle)) {
            return messageGeneral(res, 400, false, "", "El campo Calle es inválido, debe contener entre 5 y 50 letras, sin números o caracteres especiales.");
        }

        if (!valNumero.test(data.Numero)) {
            return messageGeneral(res, 400, false, "", "El campo Número es inválido, debe ser numérico y tener entre 1 y 4 dígitos.");
        }

        if (!valColonia.test(data.Colonia)) {
            return messageGeneral(res, 400, false, "", "El campo Colonia es inválido, debe contener entre 5 y 50 letras, sin números o caracteres especiales.");
        }

        if (!valLocalidad.test(data.Localidad)) {
            return messageGeneral(res, 400, false, "", "El campo Localidad es inválido, debe contener entre 5 y 50 letras, sin números o caracteres especiales.");
        }

        if (!valMunicipio.test(data.Municipio)) {
            return messageGeneral(res, 400, false, "", "El campo Municipio es inválido, debe contener entre 5 y 50 letras, sin números o caracteres especiales.");
        }

        if (!valCP.test(data.CP)) {
            return messageGeneral(res, 400, false, "", "El campo Código postal es inválido, debe ser numérico y tener exactamente 5 dígitos.");
        }

        if (!valTelefono.test(data.Telefono)) {
            return messageGeneral(res, 400, false, "", "El número de teléfono es inválido, debe ser numérico y tener exactamente 10 dígitos.");
        }

        if (data.Telefono !== sucursalExistente.Telefono) {
            const telefonoExistente = await Sucursal.findOne({
                where: {
                    Telefono: data.Telefono,
                    IDSucursal: { [Op.ne]: req.params.id }
                }
            });
        if (telefonoExistente) {
                return messageGeneral(res, 400, false, "", "El número de teléfono ya existe.");
            }
        }

        if (!valTipo.test(data.Tipo)) {
            return messageGeneral(res, 400, false, "", "El campo Tipo es inválido, debe contener entre 6 y 8 letras, sin números o caracteres especiales.");
        }

        const [actualizado] = await Sucursal.update(req.body, {
            where: { IDSucursal: req.params.id }
        });
        console.log(actualizado);
        const sucursalActualizada = await Sucursal.findByPk(req.params.id);

        logger.info({ usuario: usuario, rol: rol }, 'Se actualizó la sucursal '+req.body.Nombre)

        res.json(sucursalActualizada);
    }
    else {
        res.status(404).json({ error: 'Sucursal no encontrada' });
    }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al actualizar la sucursal' });
    }
};

// Eliminar una sucursal
exports.eliminarSucursal = async (req, res) => {
    const usuario = req.usuario;
    const rol = req.rol;
    try {
        const eliminado = await Sucursal.destroy({
            where: { IDSucursal: req.params.id }
        });
        if (eliminado) {
            logger.info({ usuario: usuario, rol: rol }, 'Se eliminó la sucursal con el id '+req.params.id)
            res.status(200).json({ message: 'Sucursal eliminada' });
        } else {
            res.status(404).json({ error: 'Sucursal no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar la sucursal' });
    }
};
