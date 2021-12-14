import express from 'express';
import ContenedorProductos from '../classes/ContenedorProductos.js';
import upload from '../services/uploader.js';
import {io} from '../app.js';
import { authMiddleware } from '../utils.js';
import Product from '../services/productos.js';
const services = new Product();
const router = express.Router();
const contenedor  = new ContenedorProductos();
//GETS
router.get('/',(req,res)=>{
    services.getProducts().then(result=>{
        res.send(result);
    })
})
router.get('/:pid',(req,res)=>{
    let id = parseInt(req.params.pid);
    services.getProductById(id).then(result=>{
        res.send(result);
    })
})
//POSTS
router.post('/',authMiddleware,upload.single('image'),(req,res)=>{

    // let file = req.file;
    let producto = req.body;
    if(!producto.title) return res.send({status:"error",message:"datos incompletos"})
    // producto.foto = req.protocol+"://"+req.hostname+":8080"+'/images/'+file.filename;
    // producto.timeStamp= new Date().toTimeString().split(" ")[0];
    services.registrerProduct(producto).then(result=>{
        res.send(result);
        
        if(result.status==="success"){
            services.getProducts().then(result=>{
                console.log(result);
                io.emit('deliverProductos',result);
            })
        }
    })
})
//PUTS
router.put('/:pid',authMiddleware,(req,res)=>{
    let body = req.body;
    console.log(body)
    let id = parseInt(req.params.pid);
    console.log(id)
    services.updateProduct(id,body).then(result=>{
        res.send(result);
        
    })
})

//DELETES
router.delete('/:pid',authMiddleware,(req,res)=>{
    let id= parseInt(req.params.pid);
    services.deleteProduct(id).then(result=>{
        res.send(result)
    })
})
export default router;