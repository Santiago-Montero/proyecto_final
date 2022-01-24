const Contenedor = require("../../ContenedorArchivo")
const path = require('path')
const ruta = path.resolve(__dirname, 'productos.json')
console.log(ruta)
class ProductosDaoArchivos extends Contenedor {

    constructor() {
        super(ruta)
    }
}

module.exports = ProductosDaoArchivos
