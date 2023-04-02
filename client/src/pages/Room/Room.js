import styles from './Room.module.css'
import { Link, useLocation } from 'react-router-dom';
import React, { useContext, useEffect, useState } from 'react';
import pesquisar from '../../assets/pesquisar.png'
import settings from '../../assets/settings.png'
import add from '../../assets/add.png'
import YoutubeReact from '../../components/YoutubeReact';
import ytUrlHandler from '../../utils/UrlHandler';
import ChatClient from '../../components/Chat';
import RoomInfo from '../../components/RoomInfo';
import { SocketContext } from '../../context/Socket';


function Room() {
    const [isInfo, setInfo] = useState("false")
    const [isSettings, setSettings] = useState("false")
    const [isInvite, setInvite] = useState("false")
    const [url, setUrl] = useState("dQw4w9WgXcQ")
    const [inputYtUrl, setInputYtUrl] = useState()

    const location = useLocation()
    //usar para mostrar no botão de codigo da sala
    const code = location.state.code
    const socket = useContext(SocketContext)
    

    const infoToggle = () => {
        setInfo(!isInfo);
    };
   
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

    const leaveRoom = () => {
        //provavelmente isso vai dar erro, pois os atributos do socket
        //apenas podem ser usados no servidor
        socket.emit("leaveRoom")
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
                    <button href="#" onClick={() => setInvite(!isInvite)}><img src={add} alt="add" /></button>
                </div>
                <div className={`${styles.roomSettings} ${isSettings ? styles.hide : ""}`}>
                    <ul>
                        <li>
                            <input className={styles.gap} type="checkbox" name="theater"></input>
                            <label for="theater">Theater Mode</label>
                        </li>
                        <li>
                            <input className={styles.gap} type="checkbox" name="dark"></input>
                            <label for="dark">Dark Mode</label>
                        </li>
                    </ul>
                </div>
                <div className={`${styles.inviteSettings} ${isInvite ? styles.hide : ""}`}>
                    <button>Copy Link</button>
                </div>
            </header>
            <div className={styles.body}>
                <div className={styles.bodyLeft}>
                    <div className={styles.container}>
                        <div id='parentPlayer'  className={styles.video}>
                            {/* <video id='myvid' width="100%" height="100%" src={video} controls></video> */}
                            {/* <PlyrPlayer /> */}
                            {/*  { <PlyrPlayer />} */}
                            {/* <ReactPlayer controls={true} url={"https://www.youtube.com/watch?v=Sus6ILsmJW4"}/> */}
                            {/* <VideoPlayer url={"https://www.youtube.com/watch?v=dQw4w9WgXcQ"}/> */}
                            <YoutubeReact  url={url}/>
                        </div>
                        <form onSubmit={handleUrl} className={styles.search}>
                            <input required onChange={onChangeUrl} type="text" placeholder="Search / Youtube URL"></input>
                            <button type="submit"><img src={pesquisar} alt="pesquisar" /></button>
                        </form>
                    </div>
                    <RoomInfo
                        isInfo={isInfo}
                        infoToggle={infoToggle}
                    />
                </div>
                <div className={styles.bodyRight}>
                    <ChatClient/>
                </div>
            </div>
        </div>
    );
}

export default Room;