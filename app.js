const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const connection = require ('./src/conectionDB.js');

const app = express();
const port = 3000;

//const routerAdmin=require("./src/routes/adminRoutes.js");
//const routerCarrito=require("./src/routes/carritoRoutes.js");
//const routerCliente=require("./src/routes/clienteRoutes.js");
//const routerCompras=require("./src/routes/comprasRoutes.js");
//const routerProductos=require("./src/routes/productosRoutes.js");
const routerSucursal=require("./src/routes/sucursalRoutes");

app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(cors({origen:'*'}));

//app.use('/api/administrador', routerAdmin);
//app.use('/api/carrito',routerCarrito);
//app.use('/api/cliente',routerCliente);
//app.use('/api/compras',routerCompras);
//app.use('/api/productos',routerProductos);
//app.use('/api/sucursal',routerSucursal);

app.use((req, res) => {
    es.status(404).send("Nada que mostrar el servidor")
});

app.listen(port, () =>{
    console.log(`El servidor esta corriendo en el puerto ${port}`)
});