
const firstTimeGetUrl = (socket, rooms) => {

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

}

const changeUrl = (socket, roomNSP, rooms) => {

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
}

const playPauseSync = (socket) => {

    socket.on("playPauseSync", (data) => {
        console.log("playPauseSync data: ", data)
        socket.to(socket.data.room).emit("responsePlayPauseSync", data)
    });
}

const seekSync = (socket) => {

    socket.on("seekSync", (data) => {
        console.log("seekSync data: ", data)
        socket.to(socket.data.room).emit("responseSeekSync", data)
    });
}

export {
    firstTimeGetUrl,
    changeUrl,
    playPauseSync,
    seekSync
}