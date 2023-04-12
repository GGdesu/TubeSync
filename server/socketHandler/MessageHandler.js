
const message = (socket, roomNSP) => {
    
    socket.on("message", data => {

        roomNSP.in(socket.data.room).emit('responseMessage', {
            text: data,
            id: socket.id,
            username: socket.data.username,
            timestamp: new Date().toLocaleTimeString([], { hour: "numeric", minute: "numeric" })
        }
        )

    })
}

export {
    message
}