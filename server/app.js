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

const rooms = {}

//SOCKET QUE IRA CUIDAR DA SINCRONIZACAO, CHAT E GERENCIAMENTOS DAS SALAS
const roomNSP = io.of("/room");

  roomNSP.on("connection", (socket) => {

    console.log(`client ${socket.id} connected`)

    //console.log(roomNSP.sockets.s)

    //Listeners para a sincronizacao do player

    //criar a função de trocar assim que entrar na sala
    socket.on("firstTimeGetUrl", (url, callback) => {
      console.log(`id da sala em first time get url ${socket.data.room} do socket ${socket.id} com nome ${socket.data.username}`)
      try {
        const roomURL = rooms[socket.data.room].url

        if (roomURL === "") {

          rooms[socket.data.room].url = url
          console.log("link da sala atualizado!")
          callback({
            url: roomURL,
            hasChange: false
          })
        } else if (roomURL === url) {
          console.log("O link já está atualizado!")
          callback({
            url: roomURL,
            hasChange: false
          })

        } else {
          callback({
            url: roomURL,
            hasChange: true
          })
        }

        console.log("link da sala", rooms[socket.data.room])

      } catch (error) {
        console.log("O servidor não conseguiu atualizar o link: ", error)
      }

    })


    socket.on('changeUrl', (url) => {
      console.log("link recebido " + url)
      const roomURL = rooms[socket.data.room].url

      if (roomURL === "") {
        rooms[socket.data.room].url = url
      } else if (url !== roomURL) {
        rooms[socket.data.room].url = url
        roomNSP.to(socket.data.room).emit('updateUrl', url)
      }
      console.log(rooms[socket.data.room])
      //socket.broadcast.emit('updateUrl', url)
    })

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

    socket.on("joinRoom", (data, callback) => {

      const room = roomNSP.adapter.rooms.get(data.roomID)
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
      socket.data.admin = false
      socket.data.room = data.roomID

      //console.log("user: " + socket.data.username + " entrou na sala")
      socket.join(data.roomID)

      //console.log("room size: ", room.size)
      callback({
        allow: true,
        message: "OK"
      })
      //updateUsersRoom(socket.data.room, roomNSP)
    });

    socket.on("leaveRoom", () => {
      let roomID = socket.data.room
      // socket.to(socket.data.room).emit('responseMessage', {
        //   username: "Server",
        //   message: `usuário ${socket.data.username} saiu da sala`
        // })
        socket.leave(roomID)
        socket.to(socket.data.room).emit("userLeaveMsg", socket.data.username)
      //checar se ele manda a atualização da sala com o usuario que saiu ou ele ja manda sem esse usuário
      updateUsersRoom(roomID, roomNSP)
    })

    //quando o usuario entrar na sala, sera notificado a todos atraves de uma msg
    //todos tambem receberao uma atualizacao dos usuarios na sala
    socket.on("userJoined", () => {
      updateUsersRoom(socket.data.room, roomNSP)
      socket.to(socket.data.room).emit("userJoinMsg", socket.data.username)
      
      
    })

    //update user listener provavelmente vai enviar não apenas o nome, como outras infos, tipo se é o admin da sala
    socket.on("updateUsers", () => {
      console.log("Updating Users")
      updateUsersRoom(socket.data.room, roomNSP)
    })

    socket.on("disconnecting", (reason) => {
      let rooms = socket.rooms
      console.log("disconnecting")
      rooms.forEach(room => {
        if (room !== socket.id) {
          //antes de sair, emitir uma sinalização para as salas avisando que está deixando a sala
          //socket.in(room).emit("userLeaveMsg", "User " + socket.data.username + " Saiu da sala")
          console.log("room size: ", roomNSP.adapter.rooms.get(room).size)
          console.log("room: " + room)
        }

      })

    })

    socket.on("disconnect", (reason) => {
      console.log(`server: ${socket.id} disconnected \n${reason}`)
    })
    //----------------------------------------------------------------

    //listener para o chat de mensagens
    console.log(`client ${socket.id} connected to chat`)

    socket.on("message", data => {

      roomNSP.in(socket.data.room).emit('responseMessage', {
        type: 'message',
        text: data,
        id: socket.id,
        username: socket.data.username,
        timestamp: new Date().toLocaleTimeString([], { hour: "numeric", minute: "numeric" })
      }
      )
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
        let user = { username: socket.data.username, admin: socket.data.admin }
        users.push(user)
        console.log("user: " + user.username)
      })

      return users
    }
  })
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));




