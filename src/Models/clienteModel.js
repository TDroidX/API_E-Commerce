const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../conectionDB')

const Cliente = sequelize.define('Cliente', {
    IDCliente: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    Nombre: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    Apellidos: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    Sexo: {
        type: DataTypes.CHAR(1)
    },
    Edad: {
        type: DataTypes.SMALLINT(4)
    },
    Fecha_nacimiento: {
        type: DataTypes.DATE
    },
    Calle: {
        type: DataTypes.STRING(50)
    },
    Numero: {
        type: DataTypes.SMALLINT(4)
    },
    Colonia: {
        type: DataTypes.STRING(50)
    },
    Localidad: {
        type: DataTypes.STRING(50)
    },
    Municipio: {
        type: DataTypes.STRING(50)
    },
    CP: {
        type: DataTypes.CHAR(5)
    },
    Telefono: {
        type: DataTypes.BIGINT(10),
        allowNull: false,
        unique: true
    },
    Correo: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
    },
    Usuario: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true
    },
    Password: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
    },
    Rol: {
        type:DataTypes.STRING,
        defaultValue: 'administrador'
    }
}, {
    tableName: 'cliente',
    timestamps: false
});

module.exports = Cliente;