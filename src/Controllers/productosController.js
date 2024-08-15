const connection = require('../conectionDB.js');
const Productos = require ('../Models/productosModel.js');
const message = require('../utils/messages.js');
const {messageGeneral} = message;
const { Op } = require('sequelize');
const valNombre = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{5,50}$/;
const valDescripcion = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{5,50}$/;
const valNumero = /^[0-9]{1,4}$/;
const valColonia = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{5,50}$/;
const valLocalidad = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{5,50}$/;
const valMunicipio = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{5,50}$/;
const valCP = /^[0-9]{5}$/; 
const valTelefono = /^[0-9]{10}$/;
const valTipo = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{6,8}$/;

// Crear una nueva sucursal
exports.crearProductos = async (req, res) => {
    try {
        const data = req.body;

        const allowedFields = ['Nombre', 'Descripcion', 'PesoContenido', 'Piezas', 'Precio', 'Sucursal', 'Marca', 'Existencias', 'Categoria', 'Imagen'];

        const invalidFields = Object.keys(data).filter(field => !allowedFields.includes(field));
        if (invalidFields.length > 0) {
        return messageGeneral(res, 400, false, "", `Campos no permitidos: ${invalidFields.join(', ')}`);
        }

        for (const field of allowedFields) {
        if (!data[field] || data[field].trim() === "") {
            return messageGeneral(res, 400, false, "", `El campo ${field} no puede estar vacío.`);
        } 
        } 

        if (!valNombre.test(data.Nombre)) {
            return messageGeneral(res, 400, false, "", "Campo Nombre inválido, debe contener entre 5 y 50 caracteres, sin números o caracteres especiales");
        }
        
        if (!valDescripcion.test(data.Descripcion)) {
            return messageGeneral(res, 400, false, "", "Campo descripcion inválido, debe contener de 5 a 100 letras, sin números o caracteres especiales .");
        }

        if (!valPesoContenido.test(data.PesoContenido)) { 
            return messageGeneral(res, 400, false, "", "El campo Númeroes inválido, debe ser numérico y tener entre 1 y 4 dígitos.");
        }

        if (!valPiezas.test(data.Piezas)) {
            return messageGeneral(res, 400, false, "", "El campo Colonia es inválido, debe contener entre 5 y 50 letras, sin números o caracteres especiales .");
        }

        if (!valPrecio.test(data.Precio)) {
            return messageGeneral(res, 400, false, "", "El campo Localidad es inválido, debe contener entre 5 y 50 letras, sin números o caracteres especiales .");
        }

        if (!valSucursal.test(data.Sucursal)) {
            return messageGeneral(res, 400, false, "", "El campo Localidad es inválido, debe contener entre 5 y 50 letras, sin números o caracteres especiales .");
        }

        if (!valMarca.test(data.Marca)) {
            return messageGeneral(res, 400, false, "", "El campo Localidad es inválido, debe contener entre 5 y 50 letras, sin números o caracteres especiales .");
        }

        if (!valExistencias.test(data.Existencias)) {
            return messageGeneral(res, 400, false, "", "El campo Municipio es inválido, debe contener entre 5 y 50 letras, sin números o caracteres especiales.");
        }

        if (!valCategoria.test(data.Categoria)) {
            return messageGeneral(res, 400, false, "", "El campo Código postal es inválido, debe ser numérico y tener exactamente 5 dígitos.");
        }

        if (!valImagen.test(data.Imagen)) {o
            return messageGeneral(res, 400, false, "", "El número de teléfono es inválido, debe ser numérico y tener exactamente 10 dígitos.");
        }

        const productoExistente = await Productos.findOne({ where: { Producto: data.Producto} });
        if (productoExistente) {
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
        res.status(201).json(nuevaSucursal);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al crear la sucursal' });
    }
};

// Obtener todos los productos
exports.obtenerProductos = async (req, res) => {
    try {
        const productos = await Productos.findAll();
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos deseados' });
    }
};

// Obtener algun producto por ID
exports.obtenerProductosPorId = async (req, res) => {
    try {
        const productos = await Productos.findByPk(req.params.id);
        if (productos) {
            res.json(productos);
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
};

// Eliminar productos
exports.eliminarProducto = async (req, res) => {
    try {
        const eliminar = await Productos.destroy({
            where: { IDSucursal: req.params.id }
        });
        if (eliminar) {
            res.status(200).json({ message: 'Sucursal eliminada' });
        } else {
            res.status(404).json({ error: 'Sucursal no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar la sucursal' });
    }
};
