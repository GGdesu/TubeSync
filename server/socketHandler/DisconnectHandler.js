import { deleteRoom, updateAdmin, updateUsersRoom } from "./SocketUtil.js"

const disconnecting = (socket, roomNSP, rooms) => {

    socket.on("disconnecting", (reason) => {
        let socketRooms = socket.rooms
        console.log("disconnecting")
        socketRooms.forEach(room => {
            if (room !== socket.id) {
                //antes de sair, emitir uma sinalização para as salas avisando que está deixando a sala
                //socket.in(room).emit("userLeaveMsg", "User " + socket.data.username + " Saiu da sala")
                //console.log("room size before: ", roomNSP.adapter.rooms.get(room).size)
                //console.log("room: " + room)
                setTimeout(() => {
                    updateAdmin(room, socket, roomNSP)
                    deleteRoom(room, roomNSP, rooms)
                    updateUsersRoom(room, roomNSP)
                }, 500);
             
            }

        })

    })
}

const disconnect = (socket) => {
    socket.on("disconnect", (reason) => {
        console.log(`server: ${socket.id} disconnected \n${reason}`)
    })
    
}

export {
    disconnecting,
    disconnect
}