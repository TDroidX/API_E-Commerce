const { Sequelize } = require('sequelize');

<<<<<<< HEAD
const sequelize = new Sequelize('polainas_candies', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
=======
const sequelize = new Sequelize('sucursal', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
>>>>>>> 87a1852c40672a0cf80b90ee4ed5886efbbb1df2
});

sequelize.authenticate()
    .then(() => {
<<<<<<< HEAD
        console.log('Conexión a la base de datos establecida correctamente con Sequelize.');
    })
    .catch(err => {
        console.error('No se pudo conectar a la base de datos:', err);
=======
        console.log('Conexión a la base de datos exitosa');
    })
    .catch(err => {
        console.error('No se pudo conectar a la base de datos', err);
>>>>>>> 87a1852c40672a0cf80b90ee4ed5886efbbb1df2
    });

module.exports = sequelize;