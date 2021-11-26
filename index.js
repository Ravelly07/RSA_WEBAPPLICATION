const https = require('https');
const fs = require('fs');

const app = require('./app').default;
const SocketIO = require('socket.io');
const {joinUser,getUserID,userDisconnect,usersList} = require('./controller/funcions.controller')



//Certificado
const server = https.createServer({
      cert: fs.readFileSync('./cert/servidor.crt'),
      key: fs.readFileSync('./cert/servidor.key'),
    },
    app).listen(app.get('port'), () => {
        console.log("Server on port", app.get('port'));
  });

//WebSockets
const io = SocketIO(server);

io.on('connection',(socket)=>{

    socket.on('joinRoom', ({ username, room, pubkey }) => {

        //creación de usuario
        const newUser = joinUser(socket.id, username, room, pubkey);
        console.log('New Connection!! ', socket.id);
        console.log('User:' + newUser.username + ' Room:' + newUser.room + '\n');
        socket.join(newUser.room);//uno a los usuarios dle mismo room


        //msg de bienvenida
        socket.emit('joinRoom:welcome',{
            userID: newUser.id,
            username: newUser.username,
            text: `Welcome ${newUser.username}`,
        });

        //llave publica
        const pubkeys = usersList.map((user) =>{
            return user.pubkey;
        });

        //Comparte la llave publica
        io.sockets.emit('joinRoom:shareKeys', pubkeys);

        //Informa que se ha unido un nuevo usuario
        socket.broadcast.to(newUser.room).emit('joinRoom:newUser',{
            userID: newUser.id,
            username: newUser.username,
             text: `${newUser.username} has joined the chat`,
        });
    });

    //send data
    socket.on('chat', (data)=>{
        const user = getUserID(socket.id);

        socket.broadcast.to(user.room).emit('chat:message',{
            userID: user.id,
            username: user.username,
            text: data
        });
        //console.log(data);
    });

    //actualizamos la lista de usuarios
    socket.on('disconnect', ()=>{
        const user = userDisconnect(socket.id);

        if (user){
            io.to(user.room).emit('message', {userID: user.id,
                username: user.username,
                text: `${user.username} se ha ido`,
            });
        }
    });

    //escuchando quien escribe
    socket.on('chat:typing',(data)=>{
        socket.broadcast.emit('chat:typing',data);//broadcast no renvia d equien recibes
    });
});

// io.on('connection',(socket)=>{
//     console.log('New Connection!', socket.id);
//     //distribución del mensage
//     socket.on('chat:message',(data)=>{
//         io.sockets.emit('chat:message',data);
//         //console.log(data);
//     });
//     //escuchando quien escribe
//     socket.on('chat:typing',(data)=>{
//         socket.broadcast.emit('chat:typing',data);//broadcast no renvia d equien recibes
//     });
// });