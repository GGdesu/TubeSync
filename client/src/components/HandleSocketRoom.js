

function createRoom (socket){
    socket.emit('createRoom');
}

function joinRoom(socket, roomID) {
    socket.emit('joinRoom', roomID);
  }



