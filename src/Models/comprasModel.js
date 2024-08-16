const { Sequelize, DataTypes } = require('sequelize');
const connection = require('../conectionDB.js');

const comprasModel = connection.define('compra', {
    IDCompra: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    Fecha_Hora: {
        type: DataTypes.DATE,
        allowNull: false
    },
    IDSucursal: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    IDCliente: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    IDProducto: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    NombreProducto: {
        type: DataTypes.STRING,
        allowNull: false
    },
    CantidadProductos: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    PrecioUnitario: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    PrecioTotal: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    ArticulosTotales: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Subtotal: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    IVA: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    CostoEnvio: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    Total: {
        type: DataTypes.DECIMAL,
        allowNull: false
    }
}, 
{
    tableName: 'compra',
    timestamps: false
});

module.exports = comprasModel;