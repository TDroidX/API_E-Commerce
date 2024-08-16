require('dotenv').config(); // Carga las variables de entorno desde el archivo .env

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    dialectModule: require('mysql2'),
    logging: console.log
});

sequelize.authenticate()
    .then(() => {
        console.log('Conexión a la base de datos establecida correctamente con Sequelize.');
    })
    .catch(err => {
        console.error('No se pudo conectar a la base de datos:', err);
    });

module.exports = sequelize;
