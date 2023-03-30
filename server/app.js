import express from "express"
import { createServer } from "http"
import { Server, Socket } from "socket.io"
import { makeID } from "./utils/Util.js"

const PORT = process.env.PORT || 4001
import router from "./routes/index.js"

const app = express()
app.use(router)

const server = createServer(app)

const io = new Server(server, {
  cors: {
    origin: '*',
  }
})

//SOCKET QUE IRA CUIDAR DA SINCRONIZACAO, CHAT E GERENCIAMENTOS DAS SALAS
const roomNSP = io.of("/room");

roomNSP.on("connection", (socket) => {

  console.log(`client ${socket.id} connected`)

  //console.log(roomNSP.sockets.s)

  //Listeners para a sincronizacao do player
  socket.on("playPauseSync", (data) => {
    console.log("playPauseSync data: ", data)
    socket.broadcast.emit("responsePlayPauseSync", data)
  });

  socket.on("seekSync", (data) => {
    console.log("seekSync data: ", data)
    socket.broadcast.emit("responseSeekSync", data)
  });
  //----------------------------------------------

  //listeners para a criacao das salas
  socket.on("createRoom", (username) => {
    let ID = makeID(4)
    while (roomNSP.adapter.rooms.has(ID)) {
      ID = makeID(4)
    }
    socket.data.username = username
    socket.data.room = ID
    socket.join(ID)
    roomNSP.to(ID).emit("userJoinMsg", "User " + username + "entrou na sala")
    console.log(`room ${ID} was created`)

  });

  socket.on("joinRoom", (data, callback) => {
    
    const room = roomNSP.adapter.rooms.get(data.roomID);
    if (!room) {
      console.log(`room not found`)
      callback({
        allow: false,
        message: "Sala não encontrada!"
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
    socket.data.room = data.roomID

    //console.log("user: " + socket.data.username + " entrou na sala")
    socket.join(data.roomID)
    //não funciona eu emitir em uma sala e esperar escutar em outra
    //provavelmente terei que emitir essa notificação dentro da sala room
    //roomNSP.to(data.roomID).emit("userJoinMsg", "User " + data.username + "entrou na sala")
    console.log("room size: ", room.size)
    callback({
      allow: true,
      message: "OK"
    })
    //updateUsersRoom(socket.data.room, roomNSP)
  });

  socket.on("leaveRoom", (roomID) => {
    socket.leave(roomID)
  })

  socket.on("disconnecting", (reason) => {
    let rooms = socket.rooms
    console.log("disconnecting: ", reason)
    rooms.forEach(room => {
      //antes de sair, emitir uma sinalização para as salas avisando que está deixando a sala
      socket.in(room).emit("userLeaveMsg", "User " + socket.data.username + " Saiu da sala")
      //socket.leave(room)
      console.log("room: " + room)

    })

  })

  socket.on("disconnect", (reason) => {
    console.log(`server: ${socket.id} disconnected \n${reason}`)
  })
  //----------------------------------------------------------------

  //listeners para o chat de mensagens
  console.log(`client ${socket.id} connected to chat`)

  socket.on("message", data => {

    //getUsers()
    console.log(socket.data.username)
    console.log(socket.data.room)
    roomNSP.in(socket.data.room).emit('responseMessage', {
      text: data,
      id: socket.id,
      username: 'Joao'
    })


    /*socket.broadcast.emit("responseMessage", {
      text: data,
      id: socket.id,
      username: 'Joao'
    })*/

  })

})

const updateUsersRoom = async (roomID, roomNSP) => {
  const users = await getUsers(roomID)
  console.log("lista de user: ", users)
  roomNSP.in(roomID).emit("updateUsersRoom", users)

}

const getUsers = async (roomID) => {
  const sockets = await roomNSP.in(roomID).fetchSockets()
  let users = []
  sockets.forEach((socket) => {
    users.push(socket.data.username)
    console.log("id: " + socket.data.username)
  })

  return users
}

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));




