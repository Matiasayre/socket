import express from 'express';
import {engine} from 'express-handlebars';
import cors from 'cors';
import ContenedorProductos from './classes/ContenedorProductos.js';
import productosRouter from './routes/productos.js';
import upload from './services/uploader.js';
import __dirname from './utils.js';
import {Server} from 'socket.io';

const app = express();
const PORT = process.env.PORT || 8080;
const contenedor = new ContenedorProductos();

const server = app.listen(PORT,()=>{
    console.log("Listening on port: ",PORT)
})
export const io = new Server(server);

app.engine('handlebars',engine())
app.set('views',__dirname+'/views')
app.set('view engine','handlebars')


app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended:true}))
app.use((req,res,next)=>{
    console.log(new Date().toTimeString().split(" ")[0], req.method, req.url);
    next();
})
app.use(express.static(__dirname+'/public'));
app.use('/api/productos',productosRouter);


app.post('/api/uploadfile',upload.fields([
    {
        name:'file', maxCount:1
    },
    {
        name:"documents", maxCount:3
    }
]),(req,res)=>{
    const files = req.files;
    console.log(files);
    if(!files||files.length===0){
        res.status(500).send({messsage:"No se subió archivo"})
    }
    res.send(files);
})
app.get('/view/productos',(req,res)=>{
    contenedor.getAllProductos().then(result=>{
        let info = result.payload;
        let preparedObject ={
            productos : info
        }
        res.render('productos',preparedObject)
    })
})

//socket
io.on('connection', async socket=>{
    console.log(`El socket ${socket.id} se ha conectado`)
    let productos = await contenedor.getAllProductos();
    socket.emit('deliverProductos',productos);

})
let messages =[];

io.on("connection",socket=>{
    console.log("cliente conectado");
    socket.emit("mensajelog",messages)
    socket.emit("welcome","bienvenido")
    socket.on("mensaje",data=>{
        messages.push(data)
      io.emit("mensajelog",messages)
    })
})