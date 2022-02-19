const http=require('http');
const socketio=require('socket.io');
const Filter = require('bad-words');
const { generateMessage, generateLocationMessage } = require('./utils/messages');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users');

let server;
let io;

module.exports = (app) => {
    server = http.createServer(app);                  // Create the HTTP server using the Express app
    io = socketio(server);                            // Connect socket.io to the HTTP server

    io.on('connection', (socket) => {
        console.log('New WebSocket connection');

        // socket.emit('message', generateMessage('Welcome!'));                                 // emit ONLY to the connected socket
        // socket.broadcast.emit('message', generateMessage('A new user has joined!'))          // emit to ALL connected sockets EXPECT the current one

        // -- join the room --
        socket.on('join', (userSettings, callback) => {

            // store the user to the users array
            const { error, user } = addUser( {id:socket.id, ...userSettings } );
            if(error) return callback?callback(error):'';        // return the ack callback with the error

            socket.join(user.room);                                  // <--- attach the socket to the room

            socket.emit('message', generateMessage('Admin', 'Welcome!'));  
            socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined!`));
            io.to(user.room).emit('roomData', { room:user.room, users:getUsersInRoom(user.room)});

            if(callback) callback()  
            
            // io.to(room).emit('message', generateMessage(`User ${username} join the room ${room}`));                  // emit to everybody from the room
            // socket.broadcast.to(room).emit('message', generateMessage(`User ${username} join the room ${room}`) );   // emit to ALL connected sockets from the room EXPECT the current one 
        })

        // -- sendMessage --
        socket.on('sendMessage', (message, callback) => {
            const user = getUser(socket.id);
            if(!user) return callback('Please login!');

            const filter = new Filter();
            if(filter.isProfane(message)) {
                if (callback) return callback('Profanity is not allowed!'); 
            }

            io.to(user.room).emit('message', generateMessage(user.username, message))                                    // emit the event to ALL connected sockets of the room
            if(callback) callback()                                                                       // run the client acknowledge callback               
        })

        // -- sendLocation --
        socket.on('sendLocation', (coords, callback) => {
            // io.emit('message', `Location: lat=${coords.latitude}, long=${coords.longitude}`)
            // io.emit('message', `https://google.com/maps?q=${coords.latitude},${coords.longitude}`)

            const user = getUser(socket.id);
            if(!user) return callback('Please login!');

            io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`));
            if(callback) callback();
        })

        // -- disconnect --
        socket.on('disconnect', () => {
            const user = removeUser(socket.id);
            if(user) {
                io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left!`));
                io.to(user.room).emit('roomData', { room:user.room, users:getUsersInRoom(user.room)})
            }
        })
    })

    return server;
}



