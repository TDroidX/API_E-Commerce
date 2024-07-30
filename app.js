const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const sequelize = require('./src/conectionDB')

const app = express();
const port = 3000;
//const routerAdmin=require("./routes/adminRoutes.js");
//const routerCarrito=require("./routes/carritoRoutes.js");
const routerCliente=require("./routes/clienteRoutes.js");
//const routerCompras=require("./routes/comprasRoutes.js");
//const routerProductos=require("./routes/productosRoutes.js");
//const routerSucursal=require("./routes/sucursalRoutes.js");

app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));
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
//app.use('/api/carrito',routerCarrito);
app.use('/api/cliente',routerCliente);
//app.use('/api/compras',routerCompras);
//app.use('/api/productos',routerProductos);
//app.use('/api/sucursal',routerSucursal);

app.use((req, res) => {
    es.status(404).send("Nada que mostrar el servidor")
});

app.listen(port, () =>{
    console.log(`El servidor esta corriendo en el puerto ${port}`)
});