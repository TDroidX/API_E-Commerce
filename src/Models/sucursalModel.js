const {Sequelize, DataTypes}  = require('sequelize');
const connection = require('../conectionDB.js');

const sucursalModel = connection.define('sucursal', {
    IDSucursal : {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    Nombre:{
        type: DataTypes.STRING,
        allowNull: false
    },
    Calle:{
        type: DataTypes.STRING,
        allowNull: false
    },
    Numero:{
        type: DataTypes.SMALLINT,
        allowNull: false
    },
    Colonia:{
        type: DataTypes.STRING,
        allowNull: false
    },
    Localidad:{
        type: DataTypes.STRING,
        allowNull: false
    },
    Municipio:{
        type: DataTypes.STRING,
        allowNull: false
    },
    CP:{
        type: DataTypes.CHAR,
        allowNull: false
    },
    Telefono:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Tipo:{
        type: DataTypes.STRING,
        allowNull: false
    }
},
{
    tableName: 'sucursal',
    timestamps: false
}
)

module.exports = sucursalModel;