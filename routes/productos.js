import express from 'express';
import ContenedorProductos from '../classes/ContenedorProductos.js';
import upload from '../services/uploader.js';
import {io} from '../app.js';
import { authMiddleware } from '../utils.js';
const router = express.Router();
const contenedor  = new ContenedorProductos();
//GETS
router.get('/',(req,res)=>{
    contenedor.getAllProductos().then(result=>{
        res.send(result);
    })
})
router.get('/:pid',(req,res)=>{
    let id = parseInt(req.params.pid);
    contenedor.getProductosById(id).then(result=>{
        res.send(result);
    })
})
//POSTS
router.post('/',authMiddleware,upload.single('image'),(req,res)=>{

    let file = req.file;
    let producto = req.body;
    
    producto.foto = req.protocol+"://"+req.hostname+":8080"+'/images/'+file.filename;
    producto.timeStamp= new Date().toTimeString().split(" ")[0];
    contenedor.registerProductos(producto).then(result=>{
        res.send(result);
        
        if(result.status==="success"){
            contenedor.getAllProductos().then(result=>{
                console.log(result);
                io.emit('deliverProductos',result);
            })
        }
    })
})
//PUTS
router.put('/:pid',authMiddleware,(req,res)=>{
    let body = req.body;
    let id = parseInt(req.params.pid);
    contenedor.updateProducto(id,body).then(result=>{
        res.send(result);
        
    })
})

//DELETES
router.delete('/:pid',authMiddleware,(req,res)=>{
    let id= parseInt(req.params.pid);
    contenedor.deleteProducto(id).then(result=>{
        res.send(result)
    })
})
export default router;