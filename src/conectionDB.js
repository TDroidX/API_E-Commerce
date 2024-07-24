let DB = require('mysql');

let conection = DB.createConnection({
    host: 'localhost',
    database: 'sucursal',
    user:'root',
    password: '',
    port: 3306
});

conection.conect(function(err){
    if(err){
        console.log(err)
    }else{
        console.log('Conection succesfull');
    }
});