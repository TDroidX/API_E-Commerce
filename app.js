const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const sequelize = require('./src/conectionDB')
const bodyParser = require('body-parser')

const app = express();
const port = 3000;

//const routerAdmin=require("./src/Routes/adminRoutes.js");
const routerCarrito=require("./src/Routes/carritoRoutes.js");
const routerCliente=require("./src/Routes/clienteRoutes");
//const routerCompras=require("./src/Routes/comprasRoutes.js");
//const routerProductos=require("./src/Routes/productosRoutes.js");
const routerSucursal=require("./src/Routes/sucursalRoutes");

app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(express.json());
app.use(cors({origen:'*'}));

sequelize.sync()
.then(() => {
    console.log('Database synchronized');
})
.catch(err => {
    console.error('Error synchronizing the database:', err);
});

//app.use('/api/administrador', routerAdmin);
app.use('/api/carrito',routerCarrito);
app.use('/api/cliente',routerCliente);
//app.use('/api/compras',routerCompras);
//app.use('/api/productos',routerProductos);
app.use('/api/sucursal',routerSucursal);

app.use((req, res) => {
    res.status(404).send("Nada que mostrar el servidor")
});

app.listen(port, () =>{
    console.log(`El servidor esta corriendo en el puerto ${port}`)
});