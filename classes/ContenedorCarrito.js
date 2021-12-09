import fs from 'fs';
import __dirname from '../utils.js';

const carritosURL = __dirname+'/files/carritos.txt';

class ContenedorCarritos{
    async registerCarritos(carrito){
        try{
            let data = await fs.promises.readFile(carritosURL,'utf-8');
            let carritos = JSON.parse(data);
            let id = carritos[carritos.length-1].id+1;
            carrito =Object.assign({id:id},carrito);
            carritos.push(carrito)
            try{
                await fs.promises.writeFile(carritosURL,JSON.stringify(carritos,null,2));
                return {status:"success",message:"carrito registrado"}
            }catch{
                return {statis:"error",message:"No se pudo registrar el carrito"} 
            }
        }catch{
            carrito = Object.assign({id:1},carrito)
            try{
                await fs.promises.writeFile(carritosURL,JSON.stringify([carrito],null,2));
                return {status:"success", message:"carrito registrado"}
            }
            catch(error){
                console.log(error);
                return {status:"error",message:"No se pudo registrar el carrito"}
            }
        }
    }
    async agregarProducto(pid,cid){
        try{
            let productoData = await fs.promises.readFile(__dirname+'/files/productos.txt','utf-8');
            let carritoData = await fs.promises.readFile(carritosURL,'utf-8');
            let productos = JSON.parse(productoData);
            let carritos = JSON.parse(carritoData);
            let producto = productos.find(v=>v.id===pid);
            let carrito = carritos.find(v=>v.id===cid);
           
            if(!producto) return {status:"error", message:"No se encontró el producto"};
            if(!carrito) return {status:"error",message:"carrito no encontrado"};
            producto.assign=true;
            producto.car= carrito.id;
            carrito.producto = producto.id;
            let carritoAux = carritos.map(ca=>{
                if(ca.id===carrito.id){
                    return carrito;
                }else{
                    return ca
                }
            })
            let productoAux = productos.map(pt=>{
                if(pt.id===producto.id){
                    return producto;
                }else{
                    return pt
                }
            })
            await fs.promises.writeFile('./files/productos.txt',JSON.stringify(productoAux,null,2));
            await fs.promises.writeFile(carritosURL,JSON.stringify(carritoAux,null,2));
            return {status:"success",message:"producto asignado"}
        }catch(error){
            return {status:"error", message:"No se pudo completar el proceso de asignacion: "+error}
        }
    }
    
    async getProductosById(car){
        try{
            let data = await fs.promises.readFile(__dirname+'/files/productos.txt','utf-8');
            let productos = JSON.parse(data);
            let producto = productos.filter(v => v.car===car)

            if(producto){
                return {status:"success", payload:producto}
            }else{
                return {status:"error",message:"producto no encontrado"}
            }
        }catch{
            return {status:"error",message:"Error al obtener el producto"}
        }
    }
    async deleteProducto(pid,cid){
        try{
            let productoData = await fs.promises.readFile(__dirname+'/files/productos.txt','utf-8');
            let carritoData = await fs.promises.readFile(carritosURL,'utf-8');
            let productos = JSON.parse(productoData);
            let carritos = JSON.parse(carritoData);
            let producto = productos.find(v=>v.id===pid);
            let carrito = carritos.find(v=>v.id===cid);
            if(!producto) return {status:"error", message:"No se encontró el producto"};
            if(!carrito) return {status:"error",message:"carrito no encontrado"};
            let paux = productos.filter(producto=>producto.id!==id);
            let caux =carritos.filter(carrito=>carrito.id!==id)
            try{
                await fs.promises.writeFile(__dirname+'/files/productos.txt',JSON.stringify(paux,null,2));
                await fs.promises.writeFile(carritosURL,'utf-8',JSON.stringify(caux,null,2));
                return {status:"success",message:"producto eliminado"}
            }catch{
                return {status:"error", message:"No se pudo eliminar el producto"}
            }
        }catch{
            return {status:"error", message:"Fallo al eliminar el producto"}
        }
    }
    async deleteCarrito(id){
        try{
            let data = await fs.promises.readFile(carritosURL,'utf-8');
            let carritos = JSON.parse(data);
            console.log(carritos)
            if(!carritos.some(carrito=>carrito.id===id)) return {status:"error", message:"No hay un carrito con el id especificado"}

            let aux = carritos.filter(carrito=>carrito.id!==id);
            try{
                await fs.promises.writeFile(carritosURL,JSON.stringify(aux,null,2));
                return {status:"success",message:"producto eliminado"}
            }catch{
                return {status:"error", message:"No se pudo eliminar el carrito"}
            }
        }catch{
            return {status:"error", message:"Fallo al eliminar el carrito"}
        }
    }
}

export default ContenedorCarritos;