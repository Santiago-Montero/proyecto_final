const mongoose = require('mongoose')
const config = require('../config')
// import mongoose from 'mongoose'
// import config from '../config.js'

mongoose.connect(config.mongodb.url, config.mongodb.options)

class ContenedorMongoDb {

    constructor(nombreColeccion, esquema) {
        this.coleccion = mongoose.model(nombreColeccion, esquema)
    }

    async getById(id) {
        try {
            const docs = await this.coleccion.find({ '_id': id }, { __v: 0 })
            if (docs.length == 0) {
                console.log('No se encontro ese id')
            } else {
                return docs
            }
        } catch (err) {
            console.log(err)
        }
    }

    async getAll() {
        try {
            let docs = await this.coleccion.find({})
            return docs
        } catch (err) {
            console.log(err)
        }
    }

    async guardar(elemento) {
        try {
            let doc = await this.coleccion.create(elemento);
            return doc
        } catch (err) {
            console.log(err)
        }
    }

    async update(elemento) {
        try {
            
            const { n, nModified } = await this.coleccion.replaceOne({ '_id': elemento._id }, elemento)
            if (n == 0 || nModified == 0) {
                console.log('No se pudo actualizar no se encontro el elemento')
            } else {
                console.log('Se actualizo')
            }
        } catch (err) {
            console.log(err)
        }
    }

    async deleteById(id) {
        try {
            await this.coleccion.deleteOne({ '_id': id })
        } catch (err) {
            console.log(err)
        }
    }

    async deleteAll() {
        try {
            await this.coleccion.deleteMany({})
        } catch (err) {
            console.log(err)
        }
    }
}

module.exports = ContenedorMongoDb