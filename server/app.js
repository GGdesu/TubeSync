import express from "express"
import { createServer } from "http"
import { Server, Socket } from "socket.io"
import { clearInterval } from "timers"

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

//SOCKET QUE IRA CUIDAR DA SINCRONIZACAO
const syncPlayer = io.of("/sync-player");

syncPlayer.on("connection", (socket) => {
  console.log(`client ${socket.id} connected`);

  socket.on("playPauseSync", (data) => {
    console.log("playPauseSync data: ", data);
    socket.broadcast.emit("responsePlayPauseSync", data);
  });

  socket.on("seekSync", (data) => {
    console.log("seekSync data: ", data);
    socket.broadcast.emit("responseSeekSync", data);
  });

  socket.on("createRoom", () => {
    let ID = makeID(4);
    while (syncPlayer.adapter.rooms.has(ID)) {
      ID = makeID(4);
    }
    socket.join(ID);
    socket.emit("setID", ID);
    console.log(`room ${ID} was created`);
  });

  socket.on("joinRoom", (roomID) => {
    const room = syncPlayer.adapter.rooms.get(roomID);
    if (!room) {
      console.log(`room not found`);
      return;
    }
    /*
    if (room.size >= 5) {
      // Room is already full
      return;
    }*/
    socket.join(roomID);
    const roomSize = syncPlayer.adapter.rooms.get(roomID).size;
    syncPlayer.to(roomID).emit("roomSize", roomSize);
    socket.emit("roomJoined", roomID, roomSize);
  });

  socket.on("disconnect", (reason) => {
    console.log(`server: ${socket.id} disconnected \n${reason}`);
  });
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




