const NodeRSA = require('node-rsa');
console.log('hello client side');

const room = localStorage.getItem('room');
const userName = localStorage.getItem('username');

const typing = document.getElementById('message');
let output = document.getElementById('output');
let actions = document.getElementById('actions');

localStorage.removeItem('username');
localStorage.removeItem('room');

const socket = io();
const btn = document.getElementById('send');

const generateKey = (user) =>{
    //localStorage.setItem('username',user );

    const key = new NodeRSA({b:1024});
    const public = key.exportKey('public');
    const private = key.exportKey('private');
    localStorage.setItem(`pubKey-${user}`, public);
    localStorage.setItem(`privKey-${user}`, private);
    return  public;
};

const storePubKeys = (pubkey, username) => {
    socket.on('joinRoom:shareKeys', (keys) => {
      keys.forEach((key) => {
        //console.log("El servidor ha almacenado una llave publica!");
        let tmpKey = key.toString();
        if (tmpKey !== pubkey) {
          localStorage.setItem(`sharedKeyFor-${username}`, key);
          console.log(`Se ha guardado una llave publica de otro usuario!`);//(`Public Key has been stored: ${key}`);
        }
      });
    });
};

const decryptMessage = (message, username) => {
    const private = localStorage.getItem(`privKey-${username}`)
    const privliKey = new NodeRSA(private);

    const plaintext = privliKey.decrypt(message, 'utf8');

    return plaintext;
};

const encryptMessage = (message, username) => {
    const public = localStorage.getItem(`sharedKeyFor-${username}`);
    const publicKey = new NodeRSA(public);

    const encryptedText =publicKey.encrypt(message,'base64');

    return encryptedText;
};

const receiveDecryptedMessage = (username) => {
    socket.on('chat:message', (message) => {
        const decryptedMessage = decryptMessage(message.text.message, username);//message.text.message
        console.log(`${message.username}: ${decryptedMessage} `);

        actions.innerHTML=''
        output.innerHTML += `
        <p>
        <strong>${message.username}</strong>:  ${decryptedMessage}
        </p>`
    });
};

const sendEncryptedMessage = (username) => {
    let message = document.getElementById('message');
    //console.log(message.value);
    output.innerHTML += `
    <p>
    <strong>${username}</strong>:  ${message.value}
    </p>`

    message = encryptMessage(message.value , username);
    socket.emit('chat', { message });
};

const connection = () =>{
    const pubkey = generateKey(userName);
    socket.emit('joinRoom',{
        username: userName,
        room: room,
        pubkey
    });

    storePubKeys(pubkey,userName);
    
    receiveDecryptedMessage(userName);

}; connection();

const welcome = () => {
    socket.on('joinRoom:welcome', (message) => {
      console.log(message.text);
    });
}; welcome();

const newUser = () => {
    socket.on('joinRoom:newUser', (message) => {
      console.log(message.text);
    });
};newUser();


//Envio typing
typing.addEventListener('keypress', ()=>{
    socket.emit('chat:typing',userName)
});

//resivo typing
socket.on('chat:typing',(data)=>{
    actions.innerHTML = `
    <p>
    <em>${data} is typing </em>
    </p>
    `
});


btn.addEventListener('click', () =>{
    sendEncryptedMessage(userName);
    
    typing.value = "";
    //localStorage.setItem('miGato', 'Juan');
    //console.log({username: userName.value,message: message.value});
});