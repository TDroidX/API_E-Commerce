const Compras = require('../Models/comprasModel.js');
const { Op } = require('sequelize');

// Obtener todas las compras de un usuario por IDCliente
exports.obtenerComprasPorUsuario = async (req, res) => {
    const IDCliente = req.id;  // Suponiendo que `req.id` contiene el ID del usuario autenticado

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