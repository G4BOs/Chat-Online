const socket = io();



// Modificar tamaño de viewport en celulares
if ('visualViewport' in window){
    window.visualViewport.addEventListener('resize', ()=>{
        const viewport = window.visualViewport;
        document.documentElement.style.setProperty(
            '--viewport-heigth',`${viewport.height*0.9}px`
        );
    });
};

//====================VARIABLES Y DICCIONARIOS==============|
let mi_nombre = '';


//==========================================================|

//===================CARGAR ELEMENTOS DEL DOM===============|
const text_area = document.getElementById('txt_area');
const btn_enviar = document.getElementById('btn_enviar');
const mensajes = document.getElementById('mensajes');

//===================EVENT LISTENERS========================|
btn_enviar.addEventListener('click',()=>{
    if (text_area.value){
        //Emitir señal
        socket.emit('nuevo_mensaje',{'nombre': mi_nombre, 'mensaje': text_area.value});
        text_area.value=''
    };
    


});


//=====================FUNCIONES============================|
function añadir_mensaje(texto,n_remitente){
    //Crear elementos para mensajes nuevos

    //contenedor del mensaje ------------------------------
    let mensaje_contenedor = document.createElement('div');
    //Class del mensaje
    mensaje_contenedor.className = 'mensaje_contenedor';
    //-----------------------------------------------------


    //Crear etiqueta para poner el nombre del remitente
    //----------------------------------------------------
    let remitente = document.createElement('p');
    //Class del remitente
    remitente.className = 'nombre_remitente';
    remitente.innerText = n_remitente
    //----------------------------------------------------

    //Crear etiqueta para poner el mensaje
    //---------------------------------------------------
    let mensaje = document.createElement('p');
    //Class del mensaje
    mensaje.className = 'mensaje';
    mensaje.innerText = texto;
    //---------------------------------------------------

    //Añadir los hijos al contenedor
    mensaje_contenedor.appendChild(remitente);
    mensaje_contenedor.appendChild(mensaje);
    mensajes.appendChild(mensaje_contenedor)
};

function cargar_historial(historial){
    for (let mns in historial){
        añadir_mensaje(historial[mns].mensaje,historial[mns].remitente)
    }
};

function cargar(){
socket.emit('recibir_mensajes',{});
console.log('Enviado')
};
cargar();

//=====================CONECCIONES CON SOCKET===============|
socket.on('cargar_mensaje',(data)=>{
    añadir_mensaje(data.mensaje,data.remitente)
});

socket.on('mi_nombre',(data)=>{
    mi_nombre = data.nombre
});

socket.on('cargar_historial',(data)=>{
    cargar_historial(data)
});

socket.on('redirect',(data)=>{
    window.location.href = data.url;
})