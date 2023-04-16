import { generateId } from "../utils/Util.js"
import { createRoomPin, getRoomPin } from "../utils/roomsUtil.js";
import { checkIfNameExist, deleteRoom, updateAdmin, updateUsersRoom } from "./SocketUtil.js";


const createRoom = (socket, roomNSP, rooms) => {

  socket.on("createRoom", (username, callback) => {
    try {
      let ID = generateId(8)
      while (roomNSP.adapter.rooms.has(ID)) {
        ID = generateId(8)
      }

      if (!rooms[ID]) {
        rooms[ID] = {}
      }

      const roomPin = createRoomPin(rooms, ID)
      //alguns atributos para o usuario
      socket.data.username = username
      socket.data.admin = true
      socket.data.room = ID


      socket.join(ID)

      
      //um atributo da sala para guardar o atual url
      rooms[ID].url = ""
      callback({
        allow: true,
        username: username,
        roomID: ID,
        pin: roomPin
      })
      console.log(`room ${ID} was created`)

    } catch (error) {
      console.log("não foi possivel criar a sala, error: ", error)
    }

  });
}

const joinRoom = (socket, roomNSP, rooms) => {

  socket.on("joinRoom", async (data, callback) => {

    const room = roomNSP.adapter.rooms.get(data.roomID)
    if (!room) {
      console.log(`room not found`)
      callback({
        allow: false,
        message: "Sala não encontrada!"
      })

      return
    }

    const nameExist = await checkIfNameExist(data.roomID, data.username, roomNSP)
    if (!nameExist) {
      callback({
        allow: false,
        message: "Nome já existe na sala!"
      })

      return
    }

    const roomPin = getRoomPin(rooms, data.roomID)
    if(data.pin !== roomPin){
      console.log("Pin incorreto")
      callback({
        allow: false,
        message: "Pin incorreto"
      })

      return
    }

    if (room.size >= 5) {
      console.log("room is already full of users")
      callback({
        allow: false,
        message: "A sala está cheia!"
      })

      return
    }

    console.log("joinRoom: ", data)

    socket.data.username = data.username
    socket.data.admin = false
    socket.data.room = data.roomID

    socket.join(data.roomID)

    callback({
      allow: true,
      username: socket.data.username,
      message: "OK"
    })
  })
}

const leaveRoom = (socket, roomNSP, rooms) => {

  socket.on("leaveRoom", () => {
    try {
      let roomID = socket.data.room
      socket.to(roomID).emit("userLeaveMsg", `usuário ${socket.data.username} saiu da sala`)
      socket.leave(roomID)
      deleteRoom(roomID, roomNSP, rooms)
      updateAdmin(roomID, socket, roomNSP)
      updateUsersRoom(roomID, roomNSP)
    } catch (error) {
      console.log("erro ao sair da sala -- ", error)
    }

  })
}

export {
  createRoom,
  joinRoom,
  leaveRoom
}