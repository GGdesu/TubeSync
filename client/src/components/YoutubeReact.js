import React, { useContext, useEffect, useRef, useState } from 'react';
import styles from '../pages/Room/Room.module.css'
import YouTube from 'react-youtube';
import { SocketContext } from '../context/Socket';


//pre-definições do player
const opts = {
    height: '100%',
    width: '100%',
    playerVars: {
        autoplay: 0,
    },
};


function YoutubeReact({ url }) {
    // variaveis para o gerenciamento do estado do player
    const [playing, setPlaying] = useState(false)
    const [prevPlaying, setPrevPlaying] = useState(false)

    const [seeked, setSeeked] = useState(0)
    const [isSeeked, setIsSeeked] = useState(true)

    const [sequence, setSequence] = useState([])
    const [timer, setTimer] = useState(null)
    const playerRef = useRef(null)


    const socket = useContext(SocketContext)

    const onPlayerStateChange = (event) => handleEvent(event.data)

    const handleEvent = type => {
        setSequence([...sequence, type])

        if (type === 1 && isSubArrayEnd(sequence, [2, 3])) {

            console.log("seekTo mouse")
            handleSeek() //Mouse seek
            setSequence([])
        } else if (type === 1 && isSubArrayEnd(sequence, [3])) {
            console.log("seekTo arrow")
            handleSeek() //arrow seek
            setSequence([])
        } else {
            clearTimeout(timer) // cancela os eventos anteriores
            if (type !== 3) {
                let timeout = setTimeout(() => {
                    if (type === 1) { // PLAY
                        console.log("entrou event play")
                        setPrevPlaying(false)
                        handlePlay()
                    }
                    else if (type === 2) { // PAUSE
                        console.log("entrou event pause")
                        setPrevPlaying(true)
                        handlePause()
                    }
                    setSequence([])
                }, 250);
                setTimer(timeout)
            }
        }
    }

    // Vai checar se B é SubArray de A e se encontra no fim de A.
    // eventos de "seek" acionam 2 tipos de sequencias diferentes
    // 1. O mouse seek aciona eventos pausa, buffer, play (2, 3, 1), nessa ordem.
    // 2. Arrow seek aciona eventos buffer, play (3, 1), nessa ordem.
    // esse metodo vai checar se ocorre essa sequencia
    const isSubArrayEnd = (A, B) => {
        if (A.length < B.length)
            return false;
        let i = 0;
        while (i < B.length) {
            if (A[A.length - i - 1] !== B[B.length - i - 1])
                return false;
            i++;
        }
        return true;
    };

    //funcao que recebe um tempo em segundo e busca no video
    const handleSeekTo = (seconds) => {
        if (playerRef.current) {
            setIsSeeked(false)
            playerRef.current.seekTo(seconds)
        }else{
            console.log("não conseguiu entrar no handleSeekTo")
        }

    }

    const handlePlay = () => {
        //console.log("play user-" + socket.id)
        if (playerRef.current) {
            setSeeked(playerRef.current.getCurrentTime())
            setIsSeeked(true)
            setPlaying(true)
            console.log("Play!")
            playerRef.current.playVideo()
        }
    }

    const handlePause = () => {
        //console.log("pause user-" + socket.id)
        if (playerRef.current) {
            setSeeked(playerRef.current.getCurrentTime())
            setPlaying(false)
            console.log("Pause!")
            playerRef.current.pauseVideo()
        }
    }

    const handleBuffer = () => { console.log("Buffer!") }
    const handleSeek = () => {

        if (playerRef.current) {
            setSeeked(playerRef.current.getCurrentTime())

            if (socket && isSeeked) {
                console.log("Seek!")
                console.log("current Time: ", seeked)
                console.log("Emitindo seekSync, client: ", socket.id)
                socket.emit("seekSync", { "play": playing, "seek": playerRef.current.getCurrentTime(), "client": socket.id })

            } else {
                console.log("seekTo: ", seeked)
            }

            setIsSeeked(true)
            
        }else{
            console.log("nao conseguiu entrar no handleSeek")
        }

    }

    // quando o player estiver pronto o objeto event daquele player é vinculado ao playerRef
    // com isso podemos usar as funçoes do event.target sem precisar se limitar
    // ao eventos disponibilizado
    const handlePlayerOnReady = (event) => {
        playerRef.current = event.target
        console.log("onReady\n", playerRef.current)
        //console.log("current time", playerRef.current.getCurrentTime())
    }

    // Usa o socket criado anteriormente para enviar
    useEffect(() => {


        if (socket && prevPlaying !== playing) {
            console.log("Emitindo playPauseSync, client: ", socket.id)
            socket.emit("playPauseSync", { "play": playing, "seek": seeked, "client": socket.id });

        }
    }, [playing, socket]);

    // Usa o socket criado anteriormente para receber mensagens
    useEffect(() => {

        if (socket) {
            socket.on('responsePlayPauseSync', (data) => {

                if (data["play"] === true) {
                    setPrevPlaying(true)
                    handlePlay()
                    handleSeekTo(data["seek"])

                } else if (data["play"] === false) {
                    setPrevPlaying(false)
                    handlePause()
                    handleSeekTo(data["seek"])
                }


            });

            socket.on('responseSeekSync', (data) => {
                console.log("SeekSync Resposta: ", data["seek"])

                handleSeekTo(data["seek"])
            })

            socket.on('setID', (data) => {
                console.log(`O id da sala criada eh ${data}`)
            })

        }
    }, [socket]);



    return (
        <YouTube
            videoId={url}
            ref={playerRef}
            opts={opts}
            onReady={handlePlayerOnReady}
            onStateChange={onPlayerStateChange}
            className={styles.youtube}
        />
    );
}

export default YoutubeReact