const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('polainas_candies', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    dialectModule: require('mysql2'),
    logging: console.log
});

sequelize.authenticate()
    .then(() => {
        console.log('Conexión a la base de datos polainas_candies establecida correctamente con Sequelize.');
    })
    .catch(err => {
        console.error('No se pudo conectar a la base de datos:', err);
    });

module.exports = sequelize;