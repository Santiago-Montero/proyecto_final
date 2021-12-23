const express = require('express')
const handlebars = require('express-handlebars')
const { Server: HttpServer} = require('http');
const { Server: IOServer } = require('socket.io');
const { Router } = express

const app = express();
const PORT = 3000;
const routerProductos = Router();
const routerCarrito = Router();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);
httpServer.listen(process.env.PORT || PORT);

app.engine(
    "handlebars",
    handlebars.engine()
);

app.set('views', './public/views');
app.set('view engine','handlebars');

app.use(express.json())
app.use(express.urlencoded({
    extended: true
}));
routerProductos.use(express.static('./public/assets'));

app.get("/", (req, res) =>{
    res.render('home') 
});

/*
 * productos 
 * id, timestamp, nombre, descripcion, código, foto (url), precio, stock
*/
const productos = [
    {
        nombre: "Escuadra",
        descripcion: "lorem",
        timestamp: "12/12/21",
        codigo: 12312312,
        stock: 0,
        precio: 123.45,
        foto: "https://cdn3.iconfinder.com/data/icons/education-209/64/ruler-triangle-stationary-school-256.png",
        id: 1
    },
    {
        nombre: "Calculadora",
        descripcion: "lorem",
        timestamp: "12/12/21",
        codigo: 12312312,
        stock: 0,
        precio: 234.56,
        foto: "https://cdn3.iconfinder.com/data/icons/education-209/64/calculator-math-tool-school-256.png",
        id: 2
    },
    {
        nombre: "Globo Terráqueo",
        descripcion: "lorem",
        timestamp: "12/12/21",
        codigo: 12312312,
        stock: 0,
        precio: 345.67,
        foto: "https://cdn3.iconfinder.com/data/icons/education-209/64/globe-earth-geograhy-planet-school-256.png",
        id: 3
    }
]


/* var admin */
let admin = true;
/* var admin */

routerProductos.get('/:id', (req, res) => {
    const id= req.params.id
    // if(id){
    // }
    res.render('home', {
        productos,
        productExist : productos.length != 0 ? true : false,
        admin : admin ? true : false,
    }) 
});
routerProductos.post('/', (req, res) => {
    let { nombre, descripcion, stock, precio, foto} = req.query
    const nuevoProducto = {
        nombre,
        descripcion,
        stock,
        precio,
        foto,
        timestamp: new Date(),
        codigo: 12121212,
        id :4
    }
    console.log(nuevoProducto)
    res.render('home') 
});
routerProductos.put('/:id', (req, res) => {
    let {  } = req.query
    console.log(id)
    res.render('home') 
});
routerProductos.delete('/:id', (req, res) => {
    const id= req.params
    console.log(id)
    res.render('home') 
});
routerCarrito.get('/:id', (req, res) => {
    const id= req.params
    console.log(id)
    res.render('home')
});
routerCarrito.post('/', (req, res) => {
    let {  } = req.query
    const id= req.params
    console.log(id)
    res.render('home') 
});
routerCarrito.put('/:id', (req, res) => {
    let {  } = req.query
    console.log(id)
    res.render('home') 
});
routerCarrito.delete('/:id', (req, res) => {
    const id= req.params
    console.log(id)
    res.render('home') 
});

app.use("/api/productos/", routerProductos)
app.use("/api/carrito/", routerCarrito)