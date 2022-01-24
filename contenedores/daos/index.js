let productosDao
let carritosDao


switch (process.env.DATABASE) {
    case 'firebase':
        const ProductosDaoFirebase = require('./productos/ProductosDaoFirebase.js')
        const CarritosDaoFirebase = require('./carrito/CarritosDaoFirebase.js')

        productosDao = new ProductosDaoFirebase()
        carritosDao = new CarritosDaoFirebase()
        break
    case 'mongodb':
        const ProductosDaoMongoDb = require('./productos/ProductosDaoMongoDb.js')
        const CarritosDaoMongoDb = require('./carrito/CarritosDaoMongoDb.js')

        productosDao = new ProductosDaoMongoDb()
        carritosDao = new CarritosDaoMongoDb()
        break
    default:
        const ProductosDaoArchivo = require('./productos/ProductosDaoArchivos.js')
        const CarritosDaoArchivo = require('./carrito/CarritosDaoArchivos.js')
        
        productosDao = new ProductosDaoArchivo()
        carritosDao = new CarritosDaoArchivo()
        break
}

module.exports = {
    productosDao,
    carritosDao
};