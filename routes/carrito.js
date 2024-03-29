import express from"express";
import ContenedorCarritos from "../classes/ContenedorCarrito.js";


const contenedor  = new ContenedorCarritos();
const router = express.Router();


router.get('/:id/productos',(req,res)=>{
    let car = parseInt(req.params.id);
    contenedor.getProductosById(car).then(result=>{
        res.send(result);
    })
})
router.post('/',(req,res)=>{
    
    let carrito = req.body;
    carrito.timeStamp= new Date().toTimeString().split(" ")[0];
    contenedor.registerCarritos(carrito).then(result=>{
        res.send(result);
    })
})
router.post("/:pid/productos",(req,res)=>{
    
        let productoId = parseInt(req.params.pid);
        let carritoId = parseInt(req.params.cid=1);
        contenedor.agregarProducto(productoId,carritoId).then(result=>{
          
            res.send(result);
            
        })
})
router.delete('/:pid',(req,res)=>{
    let id= parseInt(req.params.pid);
    contenedor.deleteCarrito(id).then(result=>{
        res.send(result)
    })
})
router.delete('/:id/productos/:id_prod',(req,res)=>{
    let pid= parseInt(req.params.id_prod);
    let cid = parseInt(req.params.id);
    contenedor.deleteProducto(pid,cid).then(result=>{
        res.send(result)
    })
})
export default router