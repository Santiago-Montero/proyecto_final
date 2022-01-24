const ContenedorFirebase = require("../../ContenedorFirebase")

class ProductosDaoFirebase extends ContenedorFirebase {

    constructor() {
        super('productos')
    }
}

module.exports = ProductosDaoFirebase
