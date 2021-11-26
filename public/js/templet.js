console.log('Hello Client');
const socket = io();

let userName = document.getElementById('username');
let btn = document.getElementById('send');
let output = document.getElementById('output');
let actions = document.getElementById('actions');

//Envio datos del mensaje
btn.addEventListener('click', () =>{
    socket.emit('chat:message',{
        username: userName.value,
        message: message.value
    });
    //console.log({username: userName.value,message: message.value});
});

//escucho mensajes
socket.on('chat:message', (data)=>{
    actions.innerHTML=''
    output.innerHTML += `
    <p>
    <strong>${data.username}</strong>:${data.message}
    </p>`
});

//Envio typing
message.addEventListener('keypress', ()=>{
    socket.emit('chat:typing',userName.value)
});

//resivo typing
socket.on('chat:typing',(data)=>{
    actions.innerHTML = `
    <p>
    <em>${data} is typing </em>
    </p>
    `
});