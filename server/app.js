import express from "express"
import { createServer } from "http"
import { Server, Socket } from "socket.io"

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
  socket.on("createRoom", () => {
    let ID = makeID(4)
    while (roomNSP.adapter.rooms.has(ID)) {
      ID = makeID(4)
    }
    socket.join(ID)
    socket.emit("setID", ID);
    console.log(`room ${ID} was created`)
  });

  socket.on("joinRoom", (roomID) => {
    const room = room.adapter.rooms.get(roomID);
    if (!room) {
      console.log(`room not found`)
      socket.emit("join_err", "room not found")
      return;
    }
    /*
    if (room.size >= 5) {
      // Room is already full
      return;
    }*/
    socket.join(roomID)
    const roomSize = room.adapter.rooms.get(roomID).size;
    room.to(roomID).emit("roomSize", roomSize)
    socket.emit("roomJoined", roomID, roomSize)
  });

  socket.on("disconnect", (reason) => {
    console.log(`server: ${socket.id} disconnected \n${reason}`)
  })
  //----------------------------------------------------------------

  //listeners para o chat de mensagens
  console.log(`client ${socket.id} connected to chat`)

    socket.on("message", (data) => {
        console.log("message data: ", data)
        
        const message = "user-" + socket.id.substring(0, 5) + ": " + data
        socket.broadcast.emit("responseMessage", message) 
        socket.emit("responseMessage", message) 
    })
  //--------------------------------------------------------------------
});


function makeID(length) {
  var result = "";
  var characters = "0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));




