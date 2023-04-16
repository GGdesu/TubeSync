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
import blue from '../../assets/blue-theme.png'
import original from '../../assets/original-theme.png'
import red from '../../assets/red-theme.png'
import green from '../../assets/green-theme.png'
import yellow from '../../assets/yellow-theme.png'


function Room() {
    const [isInfo, setInfo] = useState("false")
    const [isSettings, setSettings] = useState("false")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isUsersListOpen, setIsUsersListOpen] = useState(false)

    const [url, setUrl] = useState("dQw4w9WgXcQ")
    const [inputYtUrl, setInputYtUrl] = useState()
    const [users, setUsers] = useState()
    const [currentUser, setCurrentUser] = useState()
    const [allowRender, setAllowRender] = useState(true)
    const [code, setCode] = useState()
    const [pin, setPin] = useState()

    const location = useLocation()
    const navigate = useNavigate()
    
    const socket = useContext(SocketContext)


    const infoToggle = () => {
        setInfo(!isInfo);
    };
    const ulInfo = () => {
        if (window.innerWidth < 800) {
            var chat = document.getElementById("chat")
            var info = document.getElementById("info")

            chat.style.display = "flex"
            info.style.display = "none"
        }
    };
    const ulChat = () => {
        if (window.innerWidth < 800) {
            var chat = document.getElementById("chat")
            var info = document.getElementById("info")

            chat.style.display = "none"
            info.style.display = "flex"

        }
    };

    useEffect(() => {
        function handleResize() {
            var chat = document.getElementById("chat")
            var info = document.getElementById("info")

            if (window.innerWidth > 800) {
                chat.style.display = "flex"
                info.style.display = "flex"
            } else {
                chat.style.display = "none"
                info.style.display = "none"
            }
        }

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

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
        //console.log(element)
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
        console.log(`Usuario ${res.username} é admin? ${res.admin}`)

        setCurrentUser({ username: res.username, admin: res.admin })

        console.log("first render msg", res.msg)
        if (res.allow) {

            socket.emit("userJoined")
            //pede para o servidor mandar caso tenha um link de video atualizado
            socket.emit("firstTimeGetUrl", url, (response) => {
                console.log("url recebido ", response)
                if (response.hasChange) {
                    setUrl(response.url)
                }


                setCode(location.state.code ?? "none")
                setPin(location.state.pin ?? "none")
                //setCurrentUser(location.state.user ?? "none")

            })
            //adiciona o codigo da sala na variavel code
            //coloca a resposta que vai decider se vai poder renderizar a sala ou não
            setAllowRender(res.allow)

            return res.allow

        } else {
            console.log(res.allow)
            setAllowRender(res.allow)
            return res.allow
        }

    }

    function copyRoomCode() {
        let roomCode = code
        navigator.clipboard.writeText(roomCode);
    }

    function copyRoomPin() {
        let roomPin = pin
        navigator.clipboard.writeText(roomPin);
    }

    const updateUsersRoom = (users) => {
        setUsers(users)

        console.log("update: ", users)

    }

    const updateUrl = (url) => {

        console.log("chegou o link ", url)
        setUrl(url)
    }

    const UpdateCurrentUser = () => {
        if (currentUser?.username) {

            for (const user of users) {
                if (user.username === currentUser.username && user.admin !== currentUser.admin) {
                    console.log(`current user ${currentUser.username} vai ser alterado`)
                    setCurrentUser(user)
                }
            }
        }
    }

    const updatePin = (newPin) => {
        console.log("novo pin recebido", newPin)
        setPin(newPin)
    }

    const forceLeave = (msg) => {
        toast.error(msg)
        console.log(msg)
        navigate("/")
    }

    //irá rodar apenas no primeiro render e requisitará algumas informaçoes do servidor
    useEffect(() => {
        //user vai emitir para avisar que entrou e atualizar os membros da sala
        firstTimeRender()



    }, [])

    useEffect(() => {
        UpdateCurrentUser()


    }, [users])

    //irá rodar sempre que a variavel socket sofrer alguma alteração
    useEffect(() => {

        socket.on('updateUrl', updateUrl)

        socket.on('updatePin', updatePin)

        socket.on('forceLeave', forceLeave)

        //usar isso aqui pra monitorar se o usuário se conectará após recarregar a pagina room
        socket.on("connect", () => {
            console.log(`socket ${socket.id} se conectou apartir da sala room, logo ele deve ser redirecionado para home`)

            //alert(`socket id: ${socket.id} --- Usuário Não autorizado! clique "OK" para ser redirecionado para a HOMEPAGE`)
            setAllowRender(false)

        })


        socket.on("updateUsersRoom", updateUsersRoom)

        return () => {
            socket.off("updateUsersRoom", updateUsersRoom)
            socket.off('updateUrl', updateUrl)
            socket.off('updatePin', updatePin)
            socket.off('forceLeave', forceLeave)
        }


    }, [socket])

    return (
        <>{
            !allowRender ? <Navigate to="/" /> : (
                <div className={styles.app}>
                    <header className={styles.header}>
                        <div className={styles.headerLeft}>
                            <Link onClick={() => leaveRoom()} to="/"> <h1>TubeSync</h1> </Link>
                        </div>
                        <div className={styles.headerRight}>
                            <button href="#" onClick={() => setSettings(!isSettings)}><img src={settings} alt="settings" /></button>
                            <button href="#" onClick={() => setIsModalOpen(!isModalOpen)}><img src={add} alt="add" /></button>
                            <Modal id="modal" isShow={isModalOpen} setShow={() => setIsModalOpen(!isModalOpen)}>
                                <h2 className={styles.label}>Código da sala:</h2>
                                <div className={styles.copytxt}>
                                    <p className={styles.inputCopy}>{code}</p>
                                    <img className={styles.button} onClick={() => { copyRoomCode() }} src={copy} alt="copy link" />
                                </div>
                                <h2 className={styles.label}>Pin da sala:</h2>
                                <div className={styles.copytxt}>
                                    <p className={styles.inputCopy}>{pin}</p>
                                    <img className={styles.button} onClick={() => { copyRoomPin() }} src={copy} alt="copy link" />
                                </div>

                            </Modal>
                        </div>
                        <div className={`${styles.roomSettings} ${isSettings ? styles.hide : ""}`}>
                            <ul>
                                {/* <li>
                            <input className={styles.gap} type="checkbox" name="theater"></input>
                            <label for="theater">Theater Mode</label>
                        </li> */}
                                <li>
                                    <button onClick={() => changeTheme('light-mode')}><img src={blue} /></button>
                                </li>
                                <li>
                                    <button onClick={() => changeTheme('')}><img src={original} /></button>
                                </li>
                                <li>
                                    <button onClick={() => changeTheme('red-mode')}><img src={red} /></button>
                                </li>
                                <li>
                                    <button onClick={() => changeTheme('green-mode')}><img src={green} /></button>
                                </li>
                                <li>
                                    <button onClick={() => changeTheme('yellow-mode')}><img src={yellow} /></button>
                                </li>
                            </ul>
                        </div>
                    </header >
                    <div className={styles.body}>
                        <div className={styles.bodyLeft}>
                            <div id='parentPlayer' className={styles.video}>
                                <YoutubeReact url={url} />
                            </div>
                            <form onSubmit={handleUrl} className={styles.search}>
                                <input required onChange={onChangeUrl} type="text" placeholder="Search / Youtube URL"></input>
                                <button type="submit"><img src={pesquisar} alt="pesquisar" /></button>
                            </form>
                            <ul>
                                <li onClick={ulChat}>Room Info</li>
                                <li onClick={ulInfo}>Chat</li>
                            </ul>
                        </div>
                        <div className={styles.bodyRight}>
                            <RoomInfo isInfo={isInfo} infoToggle={infoToggle} users={users} typeUser={currentUser?.admin} />
                            <ChatClient />
                        </div>
                    </div>
                </div >
            )
        } </>

    );
}

export default Room;