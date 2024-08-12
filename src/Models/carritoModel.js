const {Sequelize, DataTypes}  = require('sequelize');
const connection = require('../conectionDB.js');

const carritoModel = connection.define('carrito', {
    IDCarrito : {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    IDCliente : {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    IDProducto : {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    NombreProducto:{
        type: DataTypes.STRING,
        allowNull: false
    },
    CantidadProductos:{
        type: DataTypes.SMALLINT,
        allowNull: false
    },
    PrecioUnitario:{
        type: DataTypes.FLOAT,
        allowNull: false
    },
    PrecioTotal:{
        type: DataTypes.FLOAT,
        allowNull: false
    }
},
{
    tableName: 'carrito',
    timestamps: false
}
)

module.exports = carritoModel;