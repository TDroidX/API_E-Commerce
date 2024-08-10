const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../conectionDB')

const Log = sequelize.define('Log', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    level: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    message: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    usuario: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    rol: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    fecha_hora: {
        type: DataTypes.DATE
    }
}, {
    tableName: 'logs',
    timestamps: false
});

module.exports = Log;