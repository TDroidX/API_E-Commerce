const connection = require('../conectionDB.js');
const Carrito = require('../Models/carritoModel.js');
const Cliente = require('../Models/clienteModel.js');
const Compras = require('../Models/comprasModel.js')
const Productos = require('../Models/productosModel.js');
const message = require('../utils/messages.js');
const {Op, sequelize, where} = require('sequelize');
const logger = require('../helpers/logger.js')

exports.andirCarrito = async (req, res) => {
    const IDCliente = req.id;
    const usuario = req.usuario;
    const rol = req.rol;

    try {
        const { IDProducto, CantidadProductos } = req.body;

        const cantidadProductos = parseInt(CantidadProductos);
        const producto = await Productos.findOne({
            where: { IDProducto: IDProducto },
            attributes: ['Nombre', 'Existencias', 'Precio'],
            raw: true
        });

        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        const { Nombre: nombreProducto, Existencias: existenciasProducto, Precio: precioU } = producto;
        const existencias = parseInt(existenciasProducto);

        if (cantidadProductos > existencias || existencias == 0) {
            return res.status(400).json({
                error: `Existencias insuficientes. Solo hay ${existencias} unidades disponibles de ${nombreProducto}.`
            });
        }

        const productoEnCarrito = await Carrito.findOne({
            where: { IDProducto: IDProducto, IDCliente: IDCliente },
            attributes: ['PrecioUnitario', 'CantidadProductos'],
            raw: true
        });

        let carritoActualizado;

        if (productoEnCarrito) {
            const nuevaCantidad = productoEnCarrito.CantidadProductos + cantidadProductos;
            const nuevoPrecioTotal = parseFloat((nuevaCantidad * productoEnCarrito.PrecioUnitario).toFixed(2));
            const nuevasExistencias = existencias - cantidadProductos;

            carritoActualizado = await Carrito.update({
                CantidadProductos: nuevaCantidad,
                PrecioTotal: nuevoPrecioTotal
            }, { where: { IDProducto: IDProducto, IDCliente: IDCliente } });

            await Productos.update({ Existencias: nuevasExistencias }, { where: { IDProducto: IDProducto } });
        } else {
            const precioUnitario = parseFloat(precioU);
            const precioTotal = parseFloat((precioUnitario * cantidadProductos).toFixed(2));
            const nuevasExistenciasProducto = existencias - cantidadProductos;

            carritoActualizado = await Carrito.create({
                IDCliente: IDCliente,
                IDProducto: IDProducto,
                NombreProducto: nombreProducto,
                CantidadProductos: cantidadProductos,
                PrecioUnitario: precioUnitario,
                PrecioTotal: precioTotal
            });

            await Productos.update({ Existencias: nuevasExistenciasProducto }, { where: { IDProducto: IDProducto } });
        }

        if (carritoActualizado) {
            logger.info({ usuario: usuario, rol: rol }, `Se añadió ${nombreProducto} al carrito`);
            return res.status(201).json("Producto añadido al carrito");
        } else {
            return res.status(400).json({ error: 'Error en el carrito.' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error en el servidor.' });
    }
};

//eliminar del carrito
exports.eliminarItem = async (req, res) => {
    try {
        const idCliente = req.id;
        const usuario = req.usuario;
        const rol = req.rol;
        const idProducto = req.params.id;

        // Buscar el producto en el carrito incluyendo el nombre
        const productoExiste = await Carrito.findOne({
            where: { IDCliente: idCliente, IDProducto: idProducto },
            attributes: ['NombreProducto']
        });

        if (productoExiste) {
            // Eliminar el producto del carrito
            const eliminarItem = await Carrito.destroy({
                where: { IDCliente: idCliente, IDProducto: idProducto }
            });

            // Verificar si la eliminación fue exitosa
            if (eliminarItem > 0) {
                logger.info(
                    { usuario: usuario, rol: rol },
                    `Se eliminó el producto ${productoExiste.Nombre} del carrito`
                );
                res.status(200).json("Se eliminó el item del carrito.");
            } else {
                res.status(500).json({ error: 'Error al eliminar el item del carrito.' });
            }
        } else {
            res.status(404).json({ error: 'Producto inexistente en el carrito.' });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al eliminar item del carrito.' });
    }
};

//traer el carrito
exports.traerCarrito = async (req, res) => {
    try{
        const idCliente = req.id;

        const itemsCarrito = await Carrito.findAll({where: { IDCliente: idCliente }, attributes: ['IDProducto', 'NombreProducto', 'CantidadProductos', 'PrecioUnitario', 'PrecioTotal'], raw: true });

        if (itemsCarrito.length > 0) {
            let totalProductos = 0;
            let costoTotal = 0;

            itemsCarrito.forEach(item => {
                totalProductos += item.CantidadProductos;
                costoTotal += item.PrecioTotal;
            });

            const mensaje = `El carrito contiene un total de ${totalProductos} productos con un costo total de ${costoTotal}.`;

            res.status(200).json({
                items: itemsCarrito,
                mensaje: mensaje
            });
        } else {
            res.status(404).json({ message: 'No se encontraron productos en el carrito para este cliente.' });
        }
    }catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al traer el carrito.'});
    }
}

exports.realizarCompra = async (req, res) => {
    const IDCliente = req.id;
    const usuario = req.usuario;
    const rol = req.rol;
    
    try {
        // Traer los items del carrito
        const itemsCarrito = await Carrito.findAll({ where: { IDCliente: IDCliente }, raw: true });

        if (itemsCarrito.length === 0) {
            return res.status(404).json({ message: 'El carrito está vacío.' });
        }

        // Calcular totales y preparar datos para la tabla de compras
        let subtotal = 0;
        let articulosTotales = 0;
        let costoEnvio = 150; 
        let iva = 0.16;       
        let total = 0;

        const compras = itemsCarrito.map(item => {
            const precioTotalProducto = item.PrecioTotal;
            subtotal += precioTotalProducto;
            articulosTotales += item.CantidadProductos;

            return {
                Fecha_Hora: new Date(),
                IDSucursal: item.IDSucursal || 1, // Sustituir por el ID correcto
                IDCliente: IDCliente,
                IDProducto: item.IDProducto,
                NombreProducto: item.NombreProducto,
                CantidadProductos: item.CantidadProductos,
                PrecioUnitario: item.PrecioUnitario,
                PrecioTotal: precioTotalProducto,
                ArticulosTotales: item.CantidadProductos,
                Subtotal: subtotal,
                IVA: subtotal * iva,
                CostoEnvio: costoEnvio,
                Total: subtotal + (subtotal * iva) + costoEnvio
            };
        });

        // Registrar las compras en la base de datos
        await Compras.bulkCreate(compras);

        // Vaciar el carrito
        await Carrito.destroy({ where: { IDCliente: IDCliente } });

        logger.info({ usuario: usuario, rol: rol }, `El usuario ha realizado una compra y se vació su carrito.`);

        res.status(201).json({ message: 'Compra realizada con éxito y carrito vaciado.' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al realizar la compra.' });
    }
};