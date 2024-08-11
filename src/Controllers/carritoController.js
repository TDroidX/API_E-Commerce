const connection = require('../conectionDB.js');
const Carrito = require('../models/carritoModel.js');
const Cliente = require('../models/clienteModel.js');
const Productos = require('../models/productosModel.js');
const message = require('../utils/messages.js');
const {Op, sequelize, where} = require('sequelize');

exports.andirCarrito = async (req, res) => {
    try {
        const { IDCliente, IDProducto, CantidadProductos} = req.body;

        //verificar las existencias
        const cantidadProductos= parseInt(CantidadProductos);
        const existenciasConsulta = await Productos.findOne({where: { IDProducto: IDProducto }, attributes: ['Existencias'], raw: true });
        const existenciasProducto = existenciasConsulta ? existenciasConsulta.Existencias : null;
        const existencias= parseInt(existenciasProducto);

        //traer nombre de producto
        const producto = await Productos.findOne({where: { IDProducto: IDProducto }, attributes: ['Nombre'], raw: true });
        console.log(producto); 
        const nombreProducto = producto ? producto.Nombre : null;
        console.log(nombreProducto); 

        if(cantidadProductos > existencias || existencias==0)
        {
            return res.status(400).json({ error: `Existencias insuficientes. Solo hay ${existencias} unidades disponibles de ${nombreProducto}.`});
        }
        else
        {

        //hacer que se añada al producto que ya está en el carrito
        const productoEnCarrito = await Carrito.findOne({where: { IDProducto: IDProducto, IDCliente: IDCliente}, attributes: ['PrecioUnitario', 'CantidadProductos'], raw: true});
        if(productoEnCarrito)
        {
            const precioProductoCarrito = parseFloat(productoEnCarrito ? productoEnCarrito.PrecioUnitario : null);
            const cantidadProductoCarrito = parseInt( productoEnCarrito ? productoEnCarrito.CantidadProductos : null);
            const nuevaCantidad = parseInt(cantidadProductoCarrito + cantidadProductos);
            console.log(nuevaCantidad);
            const nuevoPrecioTotal = parseFloat((nuevaCantidad * precioProductoCarrito).toFixed(2));
            console.log(nuevoPrecioTotal);
            const nuevasExistencias= existencias - cantidadProductos;
            console.log(nuevasExistencias);
            const carritoActualizadoPrecio = await Carrito.update({ PrecioTotal: nuevoPrecioTotal }, {where: { IDProducto: IDProducto, IDCliente: IDCliente}});
            const carritoActualizadoCantidad = await Carrito.update({ CantidadProductos: nuevaCantidad }, {where: { IDProducto: IDProducto, IDCliente: IDCliente}});
            const productoActualizado = await Productos.update({ Existencias: nuevasExistencias}, {where: { IDProducto: IDProducto}});
            console.log(carritoActualizadoPrecio, carritoActualizadoCantidad, productoActualizado);
            if (carritoActualizadoPrecio>0 && carritoActualizadoCantidad>0 && productoActualizado>0 )
            {
                res.status(201).json("Se añadió el producto");
            }
            else {
                return res.status(500).json({ error: 'Error al añadir al carrito' });
            }
        }
        else{
        //traer precio de producto
        const precio = await Productos.findOne({where: { IDProducto: IDProducto }, attributes: ['Precio'], raw: true });
        console.log(producto); 
        const precioU = precio ? precio.Precio : null;
        console.log(precioU); 

        //calcular precio total
        const precioUnitario= parseFloat(precioU);
        let precioTotal= precioUnitario*cantidadProductos

        const nuevoCarrito = await Carrito.create({
            IDCliente : IDCliente,
            IDProducto: IDProducto,          
            NombreProducto: nombreProducto,
            CantidadProductos: cantidadProductos,
            PrecioUnitario : precioUnitario,
            PrecioTotal: precioTotal
        });
        const nuevasExistenciasProducto= existencias - cantidadProductos;
            console.log(nuevasExistenciasProducto);
        const productoActualizadoExistencias = await Productos.update({ Existencias: nuevasExistenciasProducto}, {where: { IDProducto: IDProducto}});
        if (productoActualizadoExistencias>0 && nuevasExistenciasProducto)
            {
                res.status(201).json("Se añadió el producto.");
                res.status(201).json(nuevoCarrito);
            }
            else {
                return res.status(500).json({ error: 'Error al añadir al carrito.'});
            }
        res.status(201).json(nuevoCarrito);
        }
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al añadir al carrito.'});
    }
};

//eliminar del carrito
exports.eliminarItem = async (req, res) => {
    try{
        const idCliente = req.body.IDCliente;
        const idProducto = req.params.id;

        const productoExiste= await Carrito.findOne({where:{ IDCliente: idCliente, IDProducto: idProducto}});
        console.log(productoExiste);

        if (productoExiste) {
            const eliminarItem = await Carrito.destroy({where:{IDCliente: idCliente, IDProducto: idProducto}});
            console.log( eliminarItem );
            res.status(200).json("Se eliminó el item del carrito.");
        } else {
            res.status(404).json({ error: 'Producto inexistente en el carrito.' });
        }

    }catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al eliminar item del carrito.'});
    }
}

//traer el carrito
exports.traerCarrito = async (req, res) => {
    try{
        const idCliente = req.body.IDCliente;

        const itemsCarrito = await Carrito.findAll({where: { IDCliente: idCliente }, attributes: ['IDProducto', 'NombreProducto', 'CantidadProductos', 'PrecioUnitario', 'PrecioTotal'], raw: true });

        if (itemsCarrito.length > 0) {
            let totalProductos = 0;
            let costoTotal = 0;

            itemsCarrito.forEach(item => {
                totalProductos += item.CantidadProductos;
                costoTotal += item.PrecioTotal;
            });

            const mensaje = `El carrito contiene un total de ${totalProductos} productos con un costo total de $${costoTotal.toFixed(2)}.`;

            res.status(200).json({
                items: itemsCarrito,
                mensaje: mensaje
            });
        } else {
            res.status(404).json({ message: 'No se encontraron procudctos en el carrito para este cliente.' });
        }
    }catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al traer el carrito.'});
    }
}