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

/*const getDataAndEmit = (socket, response) => {
    socket.emit("getPlaySync", response)
}*/

/*let interval

io.on("connection", (socket) => {
    console.log(`client: ${socket.id} connected`)
    if (interval) {
        clearInterval(interval)
    }
    
    interval = setInterval(() => getApiAndEmit(socket), 1000);

    socket.on("disconnect", (reason) => {
        console.log(`client: ${socket.id} disconnected \n${reason}`)
        clearInterval(interval)
    })
})

const getApiAndEmit = socket => {
    const response = new Date()

    socket.emit("FromAPI", response)
}*/

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));




