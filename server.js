const express = require('express')
const handlebars = require('express-handlebars')
const { Server: HttpServer} = require('http');
const { Server: IOServer } = require('socket.io');
const { Router } = express

const Contenedor = require("./main.js");

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

app.get("/", async (req, res) =>{
    res.render('home') 
});

let mensaje = ''
// todos los productos de la pagina 
// const productos = [ 
//     {
//         nombre: "Escuadra",
//         descripcion: "lorem",
//         timestamp: "12/12/21",
//         codigo: 12312312,
//         stock: 0,
//         precio: 123.45,
//         foto: "https://cdn3.iconfinder.com/data/icons/education-209/64/ruler-triangle-stationary-school-256.png",
//         id: 1
//     },
//     {
//         nombre: "Calculadora",
//         descripcion: "lorem",
//         timestamp: "12/12/21",
//         codigo: 12312312,
//         stock: 0,
//         precio: 234.56,
//         foto: "https://cdn3.iconfinder.com/data/icons/education-209/64/calculator-math-tool-school-256.png",
//         id: 2
//     },
//     {
//         nombre: "Globo Terráqueo",
//         descripcion: "lorem",
//         timestamp: "12/12/21",
//         codigo: 12312312,
//         stock: 0,
//         precio: 345.67,
//         foto: "https://cdn3.iconfinder.com/data/icons/education-209/64/globe-earth-geograhy-planet-school-256.png",
//         id: 3
//     }
// ]

// const carrito = [
    //     {
        //         id: 1,
        //         timestamp: Date.now(),
        //         productos: []
        //     }
        // ]


const productosContenedor = new Contenedor('productos.txt');
const carritoContenedor = new Contenedor('carrito.txt');

/* var admin */
let admin = true;
/* var admin */
routerProductos.get('/', async (req, res) => {
    let productosInicio = await productosContenedor.getAll()
    res.render('home', {
        productosInicio,
        productExist : productosInicio? true : false
    }) 
});
routerProductos.get('/admin', async (req, res) => {
    let productosInicio = await productosContenedor.getAll()
    if(admin){
        res.render('home', {
            productosInicio,
            productExist : productosInicio ? true : false,
            admin
        }) 
    }else{
        res.send({error : "no tiene permiso para entrar a /admin"})
    }
    
});
routerProductos.get('/:id', async (req, res) => {
    const id= req.params.id
    let productosInicio  = await productosContenedor.getById(id)
    if(productosInicio){
        res.render('home', {
            productosInicio,
            productExist : productosInicio ? true : false
        }) 
    }else{
        mensaje = { error: 'No existe ese producto' };
        res.status(404).json(mensaje);
    }
});

routerProductos.post('/', async (req, res) => {
    let { nombre, descripcion, stock, precio, foto} = req.body
    const nuevoProducto = {
        nombre,
        descripcion,
        stock,
        precio,
        foto,
        timestamp: Date.now(),
        codigo: Number(productosContenedor.getRandom()),
        id : Number(productosContenedor.getId()) 
    }
    await productosContenedor.save(nuevoProducto)
    let productosInicio = await productosContenedor.getAll()
    res.render('home', {
        productosInicio,
        productExist : productosInicio ? true : false
    }) 
});

routerProductos.put('/:id', async (req, res) => {
    const id= req.params.id
    let productoViejo = await productosContenedor.productoId(id)
    if(productoViejo){
        if(req.body){
            let { nombre, descripcion, stock, precio, foto} = req.body
            await productosContenedor.updateProducto(nombre, descripcion, stock, precio, foto, productoViejo)
            res.render('home') 
        }else{
            mensaje = {'error' :'no hay que actualizar'}
            res.json(mensaje)
        }
    }else{
        mensaje = { error: 'No existe ese producto' };
        res.status(404).json(mensaje);
    }
});

routerProductos.delete('/:id', async (req, res) => {
    const id= req.params.id
    console.log(await productosContenedor.deleteProducto(id))
    console.log(await productosContenedor.getAll())
    res.render('home') 
});




routerCarrito.get('/', async (req, res) => {
    let productosEnCarrito = await carritoContenedor.getAll()
    res.json(productosEnCarrito)
});
routerCarrito.get('/:id/productos', async (req, res) => {
    const id= req.params.id
    let productoEnCarrito = await carritoContenedor.productoId(id)
    res.json(productoEnCarrito.productos)
});

routerCarrito.post('/', async (req, res) => {
    const id = carritoContenedor.getId()
    const nuevoCarrito = {
        id : id,
        timestamp: Date.now(),
        productos : []
    }
    await carritoContenedor.save(nuevoCarrito)
    //return id
});
routerCarrito.post('/:id/productos', async (req, res) => {
    const idCarrito = req.params.id
    let { nombre, descripcion, stock, precio, foto, timestamp, codigo, id} = req.body
    let producto = {
        nombre,
        descripcion,
        stock,
        precio,
        foto,
        timestamp,
        codigo,
        id
    }
    const carrito = await carritoContenedor.getById(idCarrito)
    carrito[0].productos.push(producto)
    console.log(carrito[0])
    carritoContenedor.update(idCarrito, carrito[0])
    res.json(idCarrito)
    //return id
});
routerCarrito.delete('/:id', async (req, res) => {
    const id = req.params.id
    await carritoContenedor.deleteById(id)
});
routerCarrito.delete('/:id/productos/:id_prod', async (req, res) => {
    const idProducto = req.params.id_prod
    const id= req.params.id
    const carrito = await carritoContenedor.productoId(id) // encuentro el carrito
    const productoEnCarrito = carrito.productos.find( producto => producto.id == idProducto)
    productoEnCarrito
    res.json(productoEnCarrito)
});

app.use("/api/productos/", routerProductos)
app.use("/api/carrito/", routerCarrito)