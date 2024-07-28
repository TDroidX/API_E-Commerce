const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root', 
  password: '', 
  database: 'polainas_candies' 
});

connection.connect((err) => {
  if (err) {
    console.error('Error al conectar la BD: ', err.stack);
    return;
  }
  else{
    console.log('Conexion exitosa ');
  }
  
});

module.exports = connection;