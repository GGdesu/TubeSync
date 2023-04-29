import express from "express"
import { createServer } from "http"
import { Server, Socket } from "socket.io"

//import { createRoom } from "./socketHandle/RoomHandler.js"
import * as dotenv from 'dotenv'
dotenv.config()

import {
  createRoom,
  joinRoom,
  changeUrl,
  checkIfBelong,
  disconnect,
  disconnecting,
  firstTimeGetUrl,
  leaveRoom,
  message,
  playPauseSync,
  seekSync,
  updateUsers,
  userJoined,
  kickUser
} from "./socketHandler/SocketHandler.js"

const PORT = process.env.API_PORT
import router from "./routes/index.js"

const app = express()
//app.use(router)
app.get("/", (req, res) => {
  res.send({ response: "I am Alive" }).status(200)
})

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



  firstTimeGetUrl(socket, rooms)
  changeUrl(socket, roomNSP, rooms)
  playPauseSync(socket)
  seekSync(socket)
  createRoom(socket, roomNSP, rooms)
  joinRoom(socket, roomNSP, rooms)
  checkIfBelong(socket)
  leaveRoom(socket, roomNSP, rooms)
  userJoined(socket, roomNSP)
  updateUsers(socket, roomNSP)
  message(socket, roomNSP)
  disconnecting(socket, roomNSP, rooms)
  disconnect(socket)
  kickUser(socket, roomNSP, rooms)



})

if (process.env.NODE_ENV === "production") {
  const path = require("path");
  app.use(express.static(path.resolve(__dirname, 'client', 'build')));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'), function (err) {
      if (err) {
        res.status(500).send(err)
      }
    });
  })
}

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));




