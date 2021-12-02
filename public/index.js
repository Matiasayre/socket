const socket = io();
//---------------------------EVENTOS DE SOCKET --------------------------------------
socket.on('deliverProductos',data=>{
    let productos = data.payload;
    fetch('templates/productoTable.handlebars').then(string=>string.text()).then(template=>{
        const processedTemplate = Handlebars.compile(template);
        const templateObject={
            productos:productos
        }
        const html = processedTemplate(templateObject);
        let div = document.getElementById('productoTable');
        div.innerHTML=html;
    })
})
let input = document.getElementById("mensaje")
let user = document.getElementById("name")
let message = document.getElementById("mensaje")
document.getElementById("button").addEventListener("click",(e)=>{
    
   if(e.type==="click"){
       if(e.target.value){
           
        socket.emit("mensaje",{user:user.value,message:message.value});
       }
   } 
})

socket.on("mensajelog",data=>{
  
    let p = document.getElementById("log");
    let mensajes = data.map(message=>{
        return `<div style="color:brown">${new Date().format('m-d-Y h:i:s')}    <span id="italica">${message.user} dice: ${message.message}</span></div>`
    }).join("");
    p.innerHTML= mensajes;
})


//-----------------------------FIN DE SOCKET ----------------------------------------------
document.addEventListener('submit',enviarFormulario);

function enviarFormulario(event){
    event.preventDefault();
    let form= document.getElementById('productoForm');
    let data = new FormData(form);
    fetch('/api/productos',{
        method:'POST',
        body:data
    }).then(result=>{
        return result.json();
    }).then(json=>{
        Swal.fire({
            title:'Éxito',
            text:json.message,
            icon:'success',
            timer:2000,
        }).then(result=>{
            //location.href='/'
        })
    })
}

document.getElementById("image").onchange = (e)=>{
    let read = new FileReader();
    read.onload = e =>{
        document.querySelector('.image-text').innerHTML = "producto"
        document.getElementById("preview").src = e.target.result;
    }
    
    read.readAsDataURL(e.target.files[0])
}