const admin = require('firebase-admin')
const config = require('../config.js')

admin.initializeApp({
    credential: admin.credential.cert(config.firebase)
})

const db = admin.firestore();

class ContenedorFirebase {

    constructor(nombreColeccion) {
        this.coleccion = db.collection(nombreColeccion)
    }

    async getById(id) {
        try {
            const doc = await this.coleccion.doc(id).get();
            if (!doc.exists) {
                console.log(err)
            } else {
                const data = doc.data();
                return { ...data, id }
            }
        } catch (err) {
            console.log(err)
        }
    }

    async getAll() {
        try {
            const result = []
            const snapshot = await this.coleccion.get();
            snapshot.forEach(doc => {
                result.push({ id: doc.id, ...doc.data() })
            })
            return result
        } catch (err) {
            console.log(err)
        }
    }

    async guardar(elemento) {
        try {
            const guardado = await this.coleccion.add(elemento);
            return { ...elemento, id: guardado.id }
        } catch (err) {
            console.log(err)
        }
    }

    async update(elemento) {
        try {
            const actualizado = await this.coleccion.doc(elemento.id).set(elemento);
            return actualizado
        } catch (err) {
            console.log(err)
        }
    }

    async deleteById(id) {
        try {
            const item = await this.coleccion.doc(id).delete();
            return item
        } catch (err) {
            console.log(err)
        }
    }

    async deleteAll() {
        try {
            const docs = await this.listarAll()
            const ids = docs.map(d => d.id)
            const promesas = ids.map(id => this.borrar(id))
            const resultados = await Promise.allSettled(promesas)
            const erres = resultados.filter(r => r.status == 'rejected')
            if (erres.length > 0) {
                console.log(err)
            }
        } catch (err) {
            console.log(err)
        }
    }
    async desconectar() {
    }
}

module.exports =  ContenedorFirebase