const ContenedorMongoDb = require("../../ContenedorMongo")

class CarritosDaoMongoDb extends ContenedorMongoDb {

    constructor() {
        super('carritos', {
            productos: { type: [], required: true }
        })
    }

    async guardar(carrito = { productos: [] }) {
        return super.guardar(carrito)
    }
}

module.exports = CarritosDaoMongoDb
