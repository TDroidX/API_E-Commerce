const connection = require('../conectionDB.js');
const Productos = require ('../Models/productosModel.js');
const message = require('../utils/messages.js');
const {messageGeneral} = message;
const { Op } = require('sequelize');

const valNombre = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{5,50}$/;
const valDescripcion = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s!@#$%^&*()_+\-=\\[\]{};':"`,.<>/?]{5,100}$/;
const valPesoContenido = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s]{5,50}$/;
const valPiezas = /^[0-9]{1,4}$/;
const valPrecio = /^[0-9]+(\.[0-9]+)?$/;
const valSucursal = /^[0-9]{1,3}$/;
const valMarca = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{5,25}$/;
const valExistencias = /^[0-9]{1,4}$/;
const valCategoria = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{5,50}$/;
const valImagen = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s]{0,254}$/;

// Crear un nuevo producto
exports.crearProductos = async (req, res) => {
    try {
        const data = req.body;
        const imagen = req.file;  

        const allowedFields = ['Nombre', 'Descripcion', 'PesoContenido', 'Piezas', 'Precio', 'Sucursal', 'Marca', 'Existencias', 'Categoria'];

        
        const invalidFields = Object.keys(data).filter(field => !allowedFields.includes(field));
        if (invalidFields.length > 0) {
            return messageGeneral(res, 400, false, "", `Campos no permitidos: ${invalidFields.join(', ')}`);
        }

        // Verifica si algún campo permitido está vacío
        for (const field of allowedFields) {
            if (!data[field] || data[field].trim() === "") {
                throw new Error(`El campo ${field} no puede estar vacío.`);
            }
        }

        // Validaciones específicas de cada campo
        if (!valNombre.test(data.Nombre)) {
            throw new Error("Campo Nombre inválido, debe contener entre 5 y 50 caracteres, sin números o caracteres especiales.");
        }

        if (!valDescripcion.test(data.Descripcion)) {
            throw new Error("Campo Descripción inválido, debe contener entre 5 y 100 caracteres (se permiten números y algunos caracteres especiales).");
        }

        if (!valPesoContenido.test(data.PesoContenido)) {
            throw new Error("El campo Peso/Contenido es inválido, debe tener entre 5 y 50 caracteres y solo aceptar letras y números enteros.");
        }

        if (!valPiezas.test(data.Piezas)) {
            throw new Error("El campo Piezas es inválido, debe contener solo números con un máximo de 4 dígitos.");
        }

        if (!valPrecio.test(data.Precio)) {
            throw new Error("El campo Precio es inválido, debe contener solo valores numéricos.");
        }

        if (!valSucursal.test(data.Sucursal)) {
            throw new Error("El campo Sucursal es inválido, debe ser un número entero con un máximo de 3 dígitos.");
        }

        if (!valMarca.test(data.Marca)) {
            throw new Error("El campo Marca es inválido, debe contener entre 5 y 25 letras, sin números o caracteres especiales.");
        }

        if (!valExistencias.test(data.Existencias)) {
            throw new Error("El campo Existencias es inválido, debe contener únicamente números con un máximo de 4 dígitos.");
        }

        if (!valCategoria.test(data.Categoria)) {
            throw new Error("El campo Categoría es inválido, debe contener entre 5 y 50 letras sin caracteres especiales.");
        }

        if (!imagen) {
            throw new Error("El campo Imagen es obligatorio.");
        }

        // Crear el nuevo producto
        const nuevoProducto = await Productos.create({
            Nombre: data.Nombre,
            Descripcion: data.Descripcion,
            PesoContenido: data.PesoContenido,
            Piezas: data.Piezas,
            Precio: data.Precio,
            Sucursal: data.Sucursal,
            Marca: data.Marca,
            Existencias: data.Existencias,
            Categoria: data.Categoria,
            Imagen: imagen.filename 
        });

        res.status(201).json(nuevoProducto);
    } catch (error) {
        console.log(error); 
        res.status(400).json({ error: "Nombre ya existente" }); 
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
            where: { IDProducto: req.params.id }  // Cambiado de IDSucursal a IDProducto
        });
        if (eliminar) {
            res.status(200).json({ message: 'Producto eliminado' });
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
};
