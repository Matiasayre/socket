import fs from 'fs';
import __dirname from '../utils.js';

const productosURL = __dirname+'/files/productos.txt';

class ContenedorProductos{
    async registerProductos(producto){
        try{
            let data = await fs.promises.readFile(productosURL,'utf-8');
            let productos = JSON.parse(data);
            let id = productos[productos.length-1].id+1;
            producto =Object.assign({id:id},producto);
            productos.push(producto)
            try{
                await fs.promises.writeFile(productosURL,JSON.stringify(productos,null,2));
                return {status:"success",message:"producto registrado"}
            }catch{
                return {statis:"error",message:"No se pudo registrar el producto"} 
            }
        }catch{
            producto = Object.assign({id:1},producto)
            try{
                await fs.promises.writeFile(productosURL,JSON.stringify([producto],null,2));
                return {status:"success", message:"producto registrado"}
            }
            catch(error){
                console.log(error);
                return {status:"error",message:"No se pudo registrar el producto"}
            }
        }
    }
    async getAllProductos(){
        try{
            let data = await fs.promises.readFile(productosURL,'utf-8');
            let productos = JSON.parse(data);
            return {status:"success",payload:productos}
        }catch{
            return {status:"error",message:"Error al obtener los productos. Intente más tarde"}
        }
    }
    async getProductosById(id){
        try{
            let data = await fs.promises.readFile(productosURL,'utf-8');
            let productos = JSON.parse(data);
            let producto = productos.find(v => v.id===id)
            if(pet){
                return {status:"success", payload:producto}
            }else{
                return {status:"error",message:"producto no encontrado"}
            }
        }catch{
            return {status:"error",message:"Error al obtener el producto"}
        }
    }
    async updateProducto(id,body){
        try{
            let data = await fs.promises.readFile(productosURL,'utf-8');
            let productos = JSON.parse(data);
            if(!productos.some(pt=>pt.id===id)) return {status:"error", message:"No hay productos con el id especificado"}
            let result = productos.map(producto=>{
                if(producto.id===id){
                        body = Object.assign(body)
                        body = Object.assign({id:id,...body})
                        return body;
                }else{
                    return producto;
                }
            })
            try{
                await fs.promises.writeFile(productosURL,JSON.stringify(result,null,2));
                return {status:"success", message:"Producto actualizado"}
            }catch{
                return {status:"error", message:"Error al actualizar el producto"}
            }
        }catch(error){
            return {status:"error",message:"Fallo al actualizar el producto: "+error}
        }
    }
    async deleteProducto(id){
        try{
            let data = await fs.promises.readFile(productosURL,'utf-8');
            let productos = JSON.parse(data);
            if(!productos.some(producto=>producto.id===id)) return {status:"error", message:"No hay producto con el id especificado"}

            let aux = productos.filter(producto=>producto.id!==id);
            try{
                await fs.promises.writeFile(productosURL,JSON.stringify(aux,null,2));
                return {status:"success",message:"producto eliminado"}
            }catch{
                return {status:"error", message:"No se pudo eliminar el producto"}
            }
        }catch{
            return {status:"error", message:"Fallo al eliminar el producto"}
        }
    }
}

export default ContenedorProductos;