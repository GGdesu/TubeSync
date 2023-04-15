import styles from './Room.module.css'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import React, { useContext, useEffect, useState } from 'react';
import pesquisar from '../../assets/pesquisar.png'
import settings from '../../assets/settings.png'
import add from '../../assets/add.png'
import copy from '../../assets/copy-white.png'
import YoutubeReact from '../../components/YoutubeReact';
import ytUrlHandler from '../../utils/UrlHandler';
import ChatClient from '../../components/Chat';
import RoomInfo from '../../components/RoomInfo';
import { SocketContext } from '../../context/Socket';
import Modal from '../../components/Modal';
import { toast } from 'react-hot-toast';


function Room() {
    const [isInfo, setInfo] = useState("false")
    const [isSettings, setSettings] = useState("false")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [url, setUrl] = useState("dQw4w9WgXcQ")
    const [inputYtUrl, setInputYtUrl] = useState()
    const [users, setUsers] = useState()
    const [allowRender, setAllowRender] = useState(true)
    const [code, setCode] = useState()

    const location = useLocation()
    const navigate = useNavigate()
    //usar para mostrar no botão de codigo da sala
    //const code = location.state.code !== null ? location.state.code : "none"
    const socket = useContext(SocketContext)


    const infoToggle = () => {
        setInfo(!isInfo);
    };

    const handleUrl = (e) => {
        e.preventDefault()

        let newURL = ytUrlHandler(inputYtUrl)
        console.log("novo url ", newURL)
        if (newURL === "") {
            toast.error("invalid link!")

        } else if (newURL === url) {
            console.log("Esse video já está carregado")
        } else {
            setUrl(newURL)
            socket.emit("changeUrl", newURL)

        }

    }

    const onChangeUrl = (e) => {
        //console.log("id no room", socket.data.username)
        setInputYtUrl(e.target.value)
    }

    const removeAllClasses = (element) => {
        console.log(element)
        while (element.classList.length > 0) {
            element.classList.remove(element.classList.item(0));
        }
    }

    const changeTheme = (themes) => {
        console.log('entrou na função')
        const theme = document.documentElement
        removeAllClasses(theme)
        theme.classList.add(themes)
    }
    const leaveRoom = () => {
        socket.emit("leaveRoom")
    }

    const firstTimeRender = async () => {
        let res = await socket.emitWithAck("checkIfBelong")

        console.log("first render msg", res.msg)
        if (res.allow) {
            //pede para o servidor notificar aos outros usuários que ele entrou na sala 
            //e pede para enviar uma lista atualizada dos usuários na sala
            socket.emit("userJoined")
            //pede para o servidor mandar caso tenha um link de video atualizado
            socket.emit("firstTimeGetUrl", url, (response) => {
                console.log("url recebido ", response)
                if (response.hasChange) {
                    setUrl(response.url)
                }
                console.log(res.allow)
                //adiciona o codigo da sala na variavel code
                setCode(location.state.code ?? "none")
                //coloca a resposta que vai decider se vai poder renderizar a sala ou não
                setAllowRender(res.allow)
                return res.allow
            })
        } else {
            console.log(res.allow)
            setAllowRender(res.allow)
            return res.allow
        }

    }

    function copyText() {
        var roomCode = code
        navigator.clipboard.writeText(roomCode);
    }

    const updateUsersRoom = (users) => {
        setUsers(users)
        console.log("update: ", users)
    }

    const updateUrl = (url) => {

        console.log("chegou o link ", url)
        setUrl(url)
    }

    //irá rodar apenas no primeiro render e requisitará algumas informaçoes do servidor
    useEffect(() => {
        //user vai emitir para avisar que entrou e atualizar os membros da sala
        firstTimeRender()

    }, [])



    //irá rodar sempre que a variavel socket sofrer alguma alteração
    useEffect(() => {

        socket.on('updateUrl', updateUrl)

        //usar isso aqui pra monitorar se o usuário se conectará após recarregar a pagina room
        socket.on("connect", () => {
            console.log(`socket ${socket.id} se conectou apartir da sala room, logo ele deve ser redirecionado para home`)
            //criar um roast message ao inves de um alert
            //alert(`socket id: ${socket.id} --- Usuário Não autorizado! clique "OK" para ser redirecionado para a HOMEPAGE`)
            setAllowRender(false)
            //logica para fazer ele ir para a pagina home
        })


        /*socket.on("userLeaveMsg", (msg) => {
            console.log(msg)
        })

        socket.on("UserJoinMsg", msg => {
            console.log(msg)
        })*/

        socket.on("updateUsersRoom", updateUsersRoom)

        return () => {
            socket.off("updateUsersRoom", updateUsersRoom)
            //socket.off('updateUrl', updateUrl)
        }


    }, [socket])

    return (
        <>{
            !allowRender ? <Navigate to="/" /> : (
                <div className={styles.app}>
                    <header className={styles.header}>
                        <div className={styles.headerLeft}>
                            <Link onClick={() => leaveRoom()} to="/"><h1>TubeSync</h1> </Link>
                        </div>
                        <div className={styles.headerRight}>
                            <button href="#" onClick={() => setSettings(!isSettings)}><img src={settings} alt="settings" /></button>
                            <button href="#" onClick={() => setIsModalOpen(!isModalOpen)}><img src={add} alt="add" /></button>
                            <Modal id="modal" isShow={isModalOpen} setShow={() => setIsModalOpen(!isModalOpen)}>
                                <h2 className={styles.label}>Compartilhe o código:</h2>
                                <div className={styles.copytxt}>
                                    <p className={styles.inputCopy}>{code}</p>
                                    <img className={styles.button} onClick={() => { copyText() }} src={copy} alt="copy link" />
                                </div>

                            </Modal>
                        </div>
                        <div className={`${styles.roomSettings} ${isSettings ? styles.hide : ""}`}>
                            <ul>
                                <li>
                                    <input className={styles.gap} type="checkbox" name="theater"></input>
                                    <label for="theater">Theater Mode</label>
                                </li>
                                <li>
                                    <button onClick={() => changeTheme('light-mode')}>Light Mode</button>
                                </li>
                                <li>
                                    <button onClick={() => changeTheme('')}>Dark Mode</button>
                                </li>
                            </ul>
                        </div>
                    </header>
                    <div className={styles.body}>
                        <div className={styles.bodyLeft}>
                            <div className={styles.container}>
                                <div id='parentPlayer' className={styles.video}>
                                    <YoutubeReact url={url} />
                                </div>
                                <form onSubmit={handleUrl} className={styles.search}>
                                    <input required onChange={onChangeUrl} type="text" placeholder="Search / Youtube URL"></input>
                                    <button type="submit"><img src={pesquisar} alt="pesquisar" /></button>
                                </form>
                            </div>
                            <RoomInfo isInfo={isInfo} infoToggle={infoToggle} users={users} />
                        </div>
                        <div className={styles.bodyRight}>
                            <ChatClient />
                        </div>
                    </div>
                </div >
            )} </>

    );
}

export default Room;