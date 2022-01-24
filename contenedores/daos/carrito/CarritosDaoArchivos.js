const Contenedor = require("../../ContenedorArchivo")
const path = require('path')
const ruta = path.resolve(__dirname, 'carrito.json')
console.log(ruta)
class CarritosDaoArchivos extends Contenedor {

    constructor() {
        super('./carrito.json')
    }
}

module.exports = CarritosDaoArchivos
