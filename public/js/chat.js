// console.log('Client socket.io javascript is loaded');

// set up the connection, and it’ll cause the server’s connection event handler to run.
const socket = io();                                        // same domain
// const socket = io("https://server-domain.com");          // other domain

// server (emit) -> client (receive) - message
socket.on('message', (message) => {
    // console.log(message);
    renderMessage(message);
});

// server (emit) -> client (receive) - location
socket.on('locationMessage', (location) => {
    renderLocation(location);
});

// server (emit) -> client (receive) - roomData
socket.on('roomData', (roomData) => {
    renderRoomData(roomData);
});

// client (emit) -> server (receive) - sendMessage
const emitMessage = (message, renderCallback) => {
    // console.log('emitMessage')

    // socket.emit('sendMessage', message);                         // emit without event acknowledgement
    socket.emit('sendMessage', 
        message, 
        (error) => {                                                // emit with acknowledgement callback -run when the event is acknowledged by the server
            if(error) { return renderCallback(error) }
            // console.log('Message delivered');
            renderCallback();
    });
}

// client (emit) -> server (receive) - sendLocation
const emitLocation = (coords, renderCallback) => {
    socket.emit('sendLocation',  
        { latitude:coords.latitude, longitude:coords.longitude }, 
        () => {                                 // callback
            // console.log('Location shared!');
            renderCallback();
        }
    );
}

// client (emit) -> server (receive) - join
const emitJoin = ({username='noname', room='agora'}) => {
    // console.log(username, room);
    socket.emit('join', 
        { username, room },
        (error) => {                // callback
            if(error) {
                alert(error)
                // location.href='/';
                history.back();
            }
        }
    );
}