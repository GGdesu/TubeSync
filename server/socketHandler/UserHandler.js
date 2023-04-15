import { updateUsersRoom } from "./SocketUtil.js"

const checkIfBelong = (socket) => {

    socket.on("checkIfBelong", (callback) => {
        try {
            if (typeof socket.data.room === 'undefined') {

                callback({
                    allow: false,
                    msg: "Usuário não pertence a essa sala"
                })
            } else {
                callback({
                    allow: true,
                    msg: "O usuário pertence a essa sala"
                })
            }

        } catch (error) {
            console.log("erro ao checar usuario: ", error)
        }
    })
}

const updateUsers = (socket, roomNSP) => {

    socket.on("updateUsers", (roomID) => {
        console.log("Updating Users")
        if (typeof socket.data.room === 'undefined') {
            console.log(`vai usar o roomID: ${roomID}`)
            updateUsersRoom(roomID, roomNSP)

        } else {
            console.log("vai usar o valor do socket: ", socket.data.room)
            updateUsersRoom(socket.data.room, roomNSP)

        }

    })
}

const userJoined = (socket, roomNSP) => {

    socket.on("userJoined", () => {
        socket.to(socket.data.room).emit("userJoinedMsg", `usuário ${socket.data.username} entrou na sala`)
        updateUsersRoom(socket.data.room, roomNSP)

    })
}

export {
    checkIfBelong,
    updateUsers,
    userJoined
}