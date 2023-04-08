import { makeID } from "../utils/Util"


export const roomHandler = (socket, roomNSP, makeID) => {
    
    socket.on("createRoom", (username, callback) => {
        try {
          let ID = makeID(4)
          while (roomNSP.adapter.rooms.has(ID)) {
            ID = makeID(4)
          }
          //alguns atributos para o usuario
          socket.data.username = username
          socket.data.admin = true
          socket.data.room = ID
    
    
          socket.join(ID)
    
          if (!rooms[ID]) {
            rooms[ID] = {}
          }
          //um atributo da sala para guardar o atual url
          rooms[ID].url = ""
          callback({
            allow: true,
            username: username,
            roomID: ID
          })
          //roomNSP.to(ID).emit("userJoinMsg", "User " + username + "entrou na sala")
          console.log(`room ${ID} was created`)
    
        } catch (error) {
          console.log("não foi possivel criar a sala, error: ", error)
        }
    
      });
}