const {Sequelize, DataTypes}  = require('sequelize');
const connection = require('../conectionDB.js');

const productosModel = connection.define('productos', {
    IDProducto : {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    Nombre:{
        type: DataTypes.STRING,
        allowNull: false
    },
    Descripcion:{
        type: DataTypes.STRING,
        allowNull: false
    },
    PesoContenido:{
        type: DataTypes.STRING,
        allowNull: false
    },
    Piezas:{
        type: DataTypes.STRING,
        allowNull: false
    },
    Precio:{
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    Sucursal:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Marca:{
        type: DataTypes.STRING,
        allowNull: false
    },
    Existencias:{
        type: DataTypes.SMALLINT,
        allowNull: false
    },
    Categoria:{
        type: DataTypes.STRING,
        allowNull: false
    },
    Imagen:{
        type: DataTypes.STRING
    }
}, 
{
    tableName: 'productos',
    timestamps: false
}
)

module.exports = productosModel;
 
