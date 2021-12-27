const fs = require('fs')

class Contenedor {
    constructor(name){
        this.nameFile = name,
        this.file = []
    }

    async read(){
        try{
            const contenido = await fs.promises.readFile(this.nameFile, "utf-8");
            const array = JSON.parse(contenido)
            this.file = array
            return array;
        }catch(err){
            const contenido = await fs.promises.writeFile(this.nameFile, '');
            return contenido;
        }
    }
    async save(producto){
        try {
            const productos =  await this.read();
            console.log(productos)
            if (productos == undefined) {
                producto.id = 1;
                productos.push(producto);
                console.log('hola')
            }else {
                console.log('chao')
                producto.id = this.getId()
                productos.push(producto);
            }
            const productosString = JSON.stringify(productos, null, 2);
            await fs.promises.writeFile(this.nameFile, productosString);
            return producto.id;

        } catch (error) {
            return error; // error al leer o en el proceso de guardar
        }
    }
    async getById(idProducto){
        try{
            const contenido = await this.read();
            const item = contenido.filter(producto => producto.id == idProducto);
            if(item){
                return item;
            }else{
                return null;
            }
        }catch(error){
            return error;
        }
    }
    getId(){
        let id = 0 
        this.file.forEach( producto => {
            id = Number(producto.id)
        })
        return id + 1
    }
    async getAll(){
        try{
            const listaDeProductos = await this.read();
            if(listaDeProductos){
                return listaDeProductos
            }else{
                return []
            }
        }catch (error){
            return error ;
        }
    }
    async deleteById(idProducto) {
        try{
            const listaDeProductos = await this.read();
            const productoEliminar = listaDeProductos.find(producto => producto.id == idProducto);
            if(productoEliminar){
                const listaDeProductosNueva = listaDeProductos.filter(producto => producto.id != idProducto);
                const productosString = JSON.stringify(listaDeProductosNueva, null, 2);
                fs.promises.writeFile(this.nameFile, productosString);
            }
        }catch(error){
            return error;
        }
    }
    
    async deleteAll() {
        try {
            await fs.promises.writeFile(this.nameFile, "");
        } catch (error) {
            return error;
        }
    }
    async update(id, productoAct){
        try{
            const contenidoActualizado = this.file.map(producto => {
                if (producto.id == id) {
                    const productoActualizado = {
                        productoAct
                    }
                    return productoActualizado;
                }
                return producto;
            });
            const contenidoActualizadoString = JSON.stringify(contenidoActualizado, null, 2);
            await fs.promises.writeFile(this.nameFile, contenidoActualizadoString);
        }catch(error){
            return error
        }
    }
    getRandom(){
        return Math.floor(Math.random() * (999999 - 1000)) + 1000;
    }
}

module.exports = Contenedor;