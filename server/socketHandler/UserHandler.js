import { updateRoomPin } from "../utils/roomsUtil.js"
import { removeUser, updateUsersRoom } from "./SocketUtil.js"

const checkIfBelong = (socket) => {

    socket.on("checkIfBelong", (callback) => {
        try {
            //console.log(`No if belong infos ${socket.data.username} admin ${socket.data.admin}`)
            if (typeof socket.data.room === 'undefined') {

                callback({
                    allow: false,
                    username: socket.data.username,
                    admin: socket.data.admin,
                    msg: "Usuário não pertence a essa sala"
                })
            } else {
                callback({
                    allow: true,
                    username: socket.data.username,
                    admin: socket.data.admin,
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

const kickUser = (socket, roomNSP, rooms) => {

    socket.on("kickUser", (username) => {
        try {
            const roomID = socket.data.room
            const newPin = updateRoomPin(rooms, roomID)
            removeUser(roomID, roomNSP, username)
            
            setTimeout(() => {
                roomNSP.to(roomID).emit("updatePin", newPin)
                updateUsersRoom(roomID, roomNSP)
            }, 500)
            
        } catch (error) {
            console.log("erro ao expulsar um usuário, ", error)
        }

    })
}

const userJoined = (socket, roomNSP) => {

    socket.on("userJoined", () => {
        socket.to(socket.data.room).emit("userJoinMsg", socket.data.username)

        updateUsersRoom(socket.data.room, roomNSP)

    })
}

export {
    checkIfBelong,
    updateUsers,
    userJoined,
    kickUser
}