import express from "express"
import { createServer } from "http"
import { Server, Socket } from "socket.io"
import { generateId } from "./utils/Util.js"

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
    //console.log(`id da sala em first time get url ${socket.data.room} do socket ${socket.id} com nome ${socket.data.username}`)
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
    try {
      console.log("link recebido " + url)

      //pega o a informação de url que a sala tem no servidor
      const roomURL = rooms[socket.data.room].url

      //caso seja uma string vazia, ela vai adicionar o novo link recebido ao atributo "url" da sala no objeto rooms
      // e não vai retorna o valor através de um broadcast
      if (roomURL === "") {
        rooms[socket.data.room].url = url
      } else if (url !== roomURL) {
        rooms[socket.data.room].url = url
        roomNSP.to(socket.data.room).emit('updateUrl', url)
      }
      //imprime o url da sala no servidor, para fins de visualização e entendimento do que foi feito
      console.log(rooms[socket.data.room])

    } catch (error) {
      console.log("Erro ao trocar o link do video -- ", error)
    }


  })

  socket.on("playPauseSync", (data) => {
    console.log("playPauseSync data: ", data)
    socket.to(socket.data.room).emit("responsePlayPauseSync", data)
  });

  socket.on("seekSync", (data) => {
    console.log("seekSync data: ", data)
    socket.to(socket.data.room).emit("responseSeekSync", data)
  });
  //----------------------------------------------

  //listeners para a criacao das salas
  socket.on("createRoom", (username, callback) => {
    try {
      let ID = generateId()
      while (roomNSP.adapter.rooms.has(ID)) {
        ID = generateId()
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
      console.log(`room ${ID} was created`)

    } catch (error) {
      console.log("não foi possivel criar a sala, error: ", error)
    }

  });


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

    const nameExist = await checkIfNameExist(data.roomID, data.username)
    if (!nameExist) {
      callback({
        allow: false,
        message: "Nome já existe na sala!"
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
      message: "OK"
    })
  });

  socket.on("checkIfBelong", callback => {
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

  socket.on("leaveRoom", () => {
    try {
      let roomID = socket.data.room
      socket.to(roomID).emit("userLeaveMsg", `usuário ${socket.data.username} saiu da sala`)
      socket.leave(roomID)
      deleteRoom(roomID, roomNSP)
      updateAdmin(roomID)
      updateUsersRoom(roomID, roomNSP)
    } catch (error) {
      console.log("erro ao sair da sala -- ", error)
    }

  })

  //quando o usuario entrar na sala, sera notificado a todos atraves de uma msg
  //todos tambem receberao uma atualizacao dos usuarios na sala
  socket.on("userJoined", () => {
    socket.to(socket.data.room).emit("userJoinedMsg", `usuário ${socket.data.username} entrou na sala`)
    updateUsersRoom(socket.data.room, roomNSP)

  })

  //update user listener provavelmente vai enviar não apenas o nome, como outras infos, tipo se é o admin da sala
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
          updateAdmin(room)
          deleteRoom(room, roomNSP)
          updateUsersRoom(room, roomNSP)
        }, 500);
        //
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
      text: data,
      id: socket.id,
      username: socket.data.username,
      timestamp: new Date().toLocaleTimeString([], { hour: "numeric", minute: "numeric" })
    }
    )

  })


  //utils
  const deleteRoom = (roomID, roomNSP) => {
    const serverRooms = roomNSP.adapter.rooms

    if (typeof serverRooms.get(roomID) === "undefined") {
      console.log(`A sala sera apagada ${roomID} e o URL de video que ela contem - ${rooms[roomID].url}`)
      delete rooms[roomID]
    }

  }

  //criar função pra checar se o nome do user já existe

  const updateAdmin = async (roomID) => {
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

  const checkIfNameExist = async (roomID, username) => {
    const users = await getUsers(roomID)

    if (users.some(user => user.username.toLowerCase() === username.toLowerCase())) {
      console.log("Já existe alguem com esse nome na sala. ")
      return false
    }

    return true
  }

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
    })

    return users
  }
})

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));




