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

//SOCKET QUE IRA CUIDAR DA SINCRONIZACAO
const syncPlayer = io.of("/sync-player")
syncPlayer.on("connection", (socket) => {
    console.log(`client ${socket.id} connected`)

    socket.on("playPauseSync", (data) => {
        console.log("playPauseSync data: ", data)
        socket.broadcast.emit("responsePlayPauseSync", data)
    })

    socket.on("seekSync", (data) => {
        console.log("seekSync data: ", data)
        socket.broadcast.emit("responseSeekSync", data)
    })
    
    socket.on("disconnect", (reason) => {
        console.log(`server: ${socket.id} disconnected \n${reason}`)
    })
})


server.listen(PORT, () => console.log(`Listening on port ${PORT}`));




