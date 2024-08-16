const Compras = require('../Models/comprasModel.js');
const Carrito = require('../Models/carritoModel.js')
const Producto = require('../Models/productosModel.js')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const { Op } = require('sequelize');

// Obtener todas las compras de un usuario por IDCliente
exports.obtenerComprasPorUsuario = async (req, res) => {
    const IDCliente = req.id;  // Suponiendo que `req.id` contiene el ID del usuario autenticado

    if (!IDCliente) {
        return res.status(400).json({ error: 'IDCliente no proporcionado.' });
    }


    try {
        const compras = await Compras.findAll({ where: { IDCliente: IDCliente } });
        if (compras.length === 0) {
            return res.status(404).json({ message: 'No se encontraron compras para este usuario.' });
        }
        res.status(200).json(compras);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al obtener las compras del usuario.' });
    }
};
// Obtener una compra específica por IDCompra y IDCliente
exports.obtenerCompraPorUsuarioYID = async (req, res) => {
    const IDCliente = req.id;  // Suponiendo que `req.id` contiene el ID del usuario autenticado
    const IDCompra = req.params.id;

    try {
        const compra = await Compras.findOne({ 
            where: { 
                IDCliente: IDCliente, 
                IDCompra: IDCompra 
            } 
        });
        if (!compra) {
            return res.status(404).json({ message: 'Compra no encontrada para este usuario.' });
        }
        res.status(200).json(compra);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al obtener la compra del usuario.' });
    }
};

//STRIPE

exports.crearSesionDePago = async (req, res) => {
    const idCliente = req.id;

    try {
        // Obtener los items del carrito
        const itemsCarrito = await Carrito.findAll({
            where: { IDCliente: idCliente },
            raw: true
        });

        if (itemsCarrito.length === 0) {
            return res.status(400).json({ error: 'El carrito está vacío.' });
        }

        // Crear los objetos de línea para Stripe
        const lineItems = itemsCarrito.map(item => ({
            price_data: {
                currency: 'mxn', // Cambia la moneda según tu configuración
                product_data: {
                    name: item.NombreProducto
                },
                unit_amount: parseInt(item.PrecioUnitario * 100) // Stripe usa centavos
            },
            quantity: item.CantidadProductos
        }));

        // Crear la sesión de pago en Stripe
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `https://api-e-commerce-u7d9.onrender.com`,
            cancel_url: `https://api-e-commerce-u7d9.onrender.com`,
        });

        // Devolver el ID de la sesión de pago
        res.json({ url: session.url });
    } catch (error) {
        console.error('Error al crear sesión de pago:', error);
        res.status(500).json({ error: 'Error al crear la sesión de pago.' });
    }
};
exports.cancel = (req, res) => {
    res.status(200).json({message: 'El pago ha sido cancelado'})
}