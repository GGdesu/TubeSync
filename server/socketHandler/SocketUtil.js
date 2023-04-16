
const checkIfNameExist = async (roomID, username, roomNSP) => {
    const users = await getUsers(roomID, roomNSP)

    if (users.some(user => user.username.toLowerCase() === username.toLowerCase())) {
        console.log("Já existe alguem com esse nome na sala. ")
        return false
    }

    return true
}

const updateAdmin = async (roomID, socket, roomNSP) => {
    try {
        if (socket.data.admin === true && typeof roomNSP.adapter.rooms.get(roomID) !== 'undefined') {
            const sockets = await roomNSP.in(roomID).fetchSockets()

            const randomSocket = sockets[Math.floor(Math.random() * sockets.length)]
            console.log("Novo Admin! ", randomSocket.data.username)
            randomSocket.data.admin = true

        }

    } catch (error) {
        console.log("não foi possivel Escolher o novo admin ", error)
    }

}

const updateUsersRoom = async (roomID, roomNSP) => {
    const users = await getUsers(roomID, roomNSP)
    console.log("lista de user: ", users)
    roomNSP.in(roomID).emit("updateUsersRoom", users)

}

const deleteRoom = (roomID, roomNSP, rooms) => {
    const serverRooms = roomNSP.adapter.rooms

    if (typeof serverRooms.get(roomID) === "undefined") {
        console.log(`A sala sera apagada ${roomID}. O URL de video que ela contem - ${rooms[roomID].url} e o Pin ${rooms[roomID].pin} serão excluidos`)
        delete rooms[roomID]
    }

}

const removeUser = async (roomID, roomNSP, username) => {
    const sockets = await roomNSP.in(roomID).fetchSockets()

    sockets.forEach((socket) => {
        if(socket.data.username === username){
            socket.leave(roomID)
            erasedSocketInfo(socket)
            console.log(`user ${username} removido da sala`)
            socket.emit('forceLeave', 'Voce foi removido da sala')
            return
        }
    })
}

const erasedSocketInfo = (socket) => {
    socket.data.username = ""
    socket.data.room = ""
}

const getUsers = async (roomID, roomNSP) => {
    const sockets = await roomNSP.in(roomID).fetchSockets()
    let users = []
    sockets.forEach((socket) => {
        let user = { username: socket.data.username, admin: socket.data.admin }
        users.push(user)
    })

    return users
}

export {
    checkIfNameExist,
    updateAdmin,
    updateUsersRoom,
    deleteRoom,
    removeUser,
    getUsers
}
