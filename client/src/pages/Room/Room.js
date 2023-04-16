import styles from './Room.module.css'
import { Link, useLocation } from 'react-router-dom';
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
import blue from '../../assets/blue-theme.png'
import original from '../../assets/original-theme.png'
import red from '../../assets/red-theme.png'
import green from '../../assets/green-theme.png'
import yellow from '../../assets/yellow-theme.png'


function Room() {
    const [isInfo, setInfo] = useState("false")
    const [isSettings, setSettings] = useState("false")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [url, setUrl] = useState("dQw4w9WgXcQ")
    const [inputYtUrl, setInputYtUrl] = useState()
    const [users, setUsers] = useState()

    const location = useLocation()
    //usar para mostrar no botão de codigo da sala
    const code = location.state.code
    const socket = useContext(SocketContext)
    

    const infoToggle = () => {
        setInfo(!isInfo);
    };
    const ulInfo = () => {
        if(window.innerWidth < 800){
            var chat = document.getElementById("chat")
            var info = document.getElementById("info")
            
            chat.style.display = "flex"
            info.style.display = "none"   
        }
    };
    const ulChat = () => {
        if(window.innerWidth < 800){
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

            if(window.innerWidth > 800){
                chat.style.display = "flex"
                info.style.display = "flex"
            }else{
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
        //socket.emit("updateUsers")
        console.log("entrou no handle url")
        let newURL = ytUrlHandler(inputYtUrl)
        console.log("novo url ", newURL)
        if(newURL === ""){
            alert("Invalid Link!")
        }else if(newURL === url){
            console.log("Esse video já está carregado")
        }else{
            console.log("else")
            setUrl(newURL)
            socket.emit("changeUrl", newURL)
            
        }
        
    }

    const onChangeUrl = (e) => {
        //console.log("id no room", socket.data.username)
        setInputYtUrl(e.target.value)
    }

    const removeAllClasses = (element) => {
        console.log (element)
        while (element.classList.length > 0) {
          element.classList.remove(element.classList.item(0));
        }
      }

    const changeTheme = (themes) => {
        console.log ('entrou na função')
       const theme = document.documentElement
       removeAllClasses(theme)
       theme.classList.add(themes)
    }
    const leaveRoom = () => {
        //provavelmente isso vai dar erro, pois os atributos do socket
        //apenas podem ser usados no servidor
        socket.emit("leaveRoom")
    }
    function copyText() {
        var roomCode = code
        navigator.clipboard.writeText(roomCode);
      }

    //irá rodar apenas no primeiro render e requisitará algumas informaçoes do servidor
    useEffect(() =>{
        //user vai emitir para avisar que entrou e atualizar os membros da sala
        socket.emit("userJoined")
        socket.emit("firstTimeGetUrl", url, (response) =>{
            console.log("url recebido ", response)
            if(response.hasChange){
                setUrl(response.url)
            }
            
        })
        
        /*socket.on("firstRenderUpdateUser", (UsersInfo) =>{
            UsersInfo.forEach( user => {
                console.log("info: ", user)
            });
        })*/
    }, [])

    

    useEffect(() => {
        if(socket){
            socket.on('updateUrl', url => {
                
                console.log("chegou o link ", url)
                setUrl(url)
            })
            
            /*socket.on("userLeaveMsg", (msg) => {
                console.log(msg)
            })

            socket.on("UserJoinMsg", msg => {
                console.log(msg)
            })*/
            //setCount((count) => count+1)
            //console.log(count)
            
            //antes estava no chat, mas coloquei aqui, provavelmente fique aqui
            socket.on("updateUsersRoom", (users) => {
                //console.log("usuario: ", msg)
                setUsers(users)
                console.log("update: ", users)
            })

        }
    }, [socket])
    
    return (
        <div className={styles.app}>
            <header className={styles.header}>
                <div className={styles.headerLeft}>
                    <Link onClick={() => leaveRoom()} to="/"><h1>TubeSync</h1> </Link>
                </div>
                <div className={styles.headerRight}>
                    <button href="#" onClick={() => setSettings(!isSettings)}><img src={settings} alt="settings" /></button>
                    <button href="#" onClick={()=> setIsModalOpen(!isModalOpen)}><img src={add} alt="add" /></button>
                    <Modal id="modal" isShow={isModalOpen} setShow={()=>setIsModalOpen(!isModalOpen)}>
                        <h2 className={styles.label}>Compartilhe o código:</h2>
                        <div className={styles.copytxt}>
                            <p className={styles.inputCopy}>{code}</p>
                            <img className={styles.button} onClick={()=> {copyText()}} src={copy} alt="copy link"  />
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
                            <button onClick={() => changeTheme('light-mode')}><img src={blue}/></button>
                        </li>
                        <li>
                            <button onClick={() => changeTheme('')}><img src={original}/></button>
                        </li>
                        <li>
                            <button onClick={() => changeTheme('red-mode')}><img src={red}/></button>
                        </li>
                        <li>
                            <button onClick={() => changeTheme('green-mode')}><img src={green}/></button>
                        </li>
                        <li>
                            <button onClick={() => changeTheme('yellow-mode')}><img src={yellow}/></button>
                        </li>
                    </ul>
                </div>
            </header>
            <div className={styles.body}>
                <div className={styles.bodyLeft}>
                    <div id='parentPlayer'  className={styles.video}>
                        <YoutubeReact  url={url}/>
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
                    <RoomInfo isInfo={isInfo} infoToggle={infoToggle} users={users}/>
                    <ChatClient/>
                </div>
            </div>
        </div>
    );
}

export default Room;