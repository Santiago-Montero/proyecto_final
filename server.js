
const express = require('express')
const handlebars = require('express-handlebars')
const { Server: HttpServer} = require('http');
const { Server: IOServer } = require('socket.io');
const { Router } = express

const { productosDao, carritosDao } = require('./contenedores/daos/index.js')

const app = express();
const PORT = 3000;
const routerProductos = Router();
const routerCarrito = Router();
const httpServer = new HttpServer(app);
// const io = new IOServer(httpServer);
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
/*const productos = [ 
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

const carrito = [
        {
                id: 1,
                timestamp: Date.now(),
                productos: []
            }
        ]
*/
//const Contenedor = require("./contenedores/ContenedorArchivo.js");
// const productosContenedor = new Contenedor('productos.json');
// const carritoContenedor = new Contenedor('carrito.json');

/* var admin */
let admin = true;
/* var admin */
routerProductos.get('/', async (req, res) => {
    let productosInicio = await productosDao.getAll()

    console.log(productosInicio)
    res.render('home', {
        productosInicio,
        productExist : productosInicio? true : false
    }) 
});
routerProductos.get('/admin', async (req, res) => {
    let productosInicio = await productosDao.getAll()
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
    let productosInicio  = await productosDao.getById(id)
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
        codigo: Number(productosDao.getRandom()),
        id : Number(productosDao.getId()) 
    }
    await productosDao.save(nuevoProducto)
    let productosInicio = await productosDao.getAll()
    res.render('home', {
        productosInicio,
        productExist : productosInicio ? true : false
    }) 
});

routerProductos.put('/:id', async (req, res) => {
    const id= req.params.id
    let productoViejo = await productosDao.productoId(id)
    if(productoViejo){
        if(req.body){
            let { nombre, descripcion, stock, precio, foto} = req.body
            await productosDao.updateProducto(nombre, descripcion, stock, precio, foto, productoViejo)
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
    console.log(await productosDao.deleteById(id))
    console.log(await productosDao.getAll())
    res.render('home') 
});




routerCarrito.get('/', async (req, res) => {
    let productosEnCarrito = await carritosDao.getAll()
    res.json(productosEnCarrito)
});
routerCarrito.get('/:id/productos', async (req, res) => {
    const id= req.params.id
    let productoEnCarrito = await carritosDao.productoId(id)
    res.json(productoEnCarrito.productos)
});

routerCarrito.post('/', async (req, res) => {
    const id = carritosDao.getId()
    const nuevoCarrito = {
        id : id,
        timestamp: Date.now(),
        productos : []
    }
    await carritosDao.save(nuevoCarrito)
    //return id
});
routerCarrito.post('/:id/productos', async (req, res) => {
    const idCarrito = req.params.id
    const carrito = await carritosDao.getById(idCarrito)
    if(carrito){
        let { nombre, descripcion, stock, precio, foto, timestamp, codigo, id} = req.body
        let producto = await productosDao.productoId(id)
        if (producto){
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
            carrito[0].productos.push(producto)
            carritosDao.update(idCarrito, carrito[0])
            res.json(idCarrito)
        }else{
            mensaje = { error: 'No existe ese producto' };
            res.status(404).json(mensaje);
        }
    }else{
        mensaje = { error: 'No existe ese carrito' };
        res.status(404).json(mensaje);
    }
    //return id
});
routerCarrito.delete('/:id', async (req, res) => {
    const id = req.params.id
    const carrito = await carritosDao.productoId(id)
    if(carrito){
        await carritosDao.deleteById(id)
    }else{
        mensaje = { error: 'No existe ese carrito' };
        res.status(404).json(mensaje);
    }
});
routerCarrito.delete('/:id/productos/:id_prod', async (req, res) => {
    const idProducto = req.params.id_prod
    const id= req.params.id
    const carrito = await carritosDao.productoId(id) // encuentro el carrito
    if(carrito){
        const productoEnCarrito = carrito.productos.find( producto => producto.id == idProducto)
        if(productoEnCarrito){
            for( let i = 0 ; i < carrito.productos.length ; i++){
                if(idProducto == carrito.productos[i].id){
                    carrito.productos.splice(i, 1);
                }
            }
        }else{
            mensaje = { error: 'Ese producto no esta en el carrito o no existe' };
            res.status(404).json(mensaje);
        }
    }else{
        mensaje = { error: 'No existe ese carrito' };
        res.status(404).json(mensaje);
    }
});

app.use("/api/productos/", routerProductos)
app.use("/api/carrito/", routerCarrito)