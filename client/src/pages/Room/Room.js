import styles from './Room.module.css'
import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import pesquisar from '../../assets/pesquisar.png'
import settings from '../../assets/settings.png'
import add from '../../assets/add.png'
import menos from '../../assets/menos.png'
import pointer from '../../assets/pointer.png'
import YoutubeReact from '../../components/YoutubeReact';


function Room() {
    const [isActive, setActive] = useState("false");
    const [isInfo, setInfo] = useState("false");
    const [isSettings, setSettings] = useState("false");
    const [isInvite, setInvite] = useState("false");
    const [url, setUrl] = useState("dQw4w9WgXcQ")
    const [inputYtUrl, setInputYtUrl] = useState()

    

    const infoToggle = () => {
        setInfo(!isInfo);
    };
    const handleToggle = () => {
        setActive(!isActive);
        
    };

    const handleUrl = (e) => {
        e.preventDefault() 
        setUrl(inputYtUrl)
    }

    const onChangeUrl = (e) => {
        setInputYtUrl(e.target.value)
    }
    
    return (
        <div className={styles.app}>
            <header className={styles.header}>
                <div className={styles.headerLeft}>
                    <Link to="/"><h1>TubeSync</h1> </Link>
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
                    <div className={styles.roomInfo}>
                        <div className={styles.infoHeader} onClick={infoToggle}>
                            <h3>Room info</h3>
                        </div>
                        <div className={`${styles.infoBody} ${isInfo ? styles.hide : ""}`}><h3>Informações</h3></div>
                    </div>
                </div>
                <div className={styles.bodyRight}>
                    <div className={styles.chat}>
                        <div className={styles.chatHeader} onClick={handleToggle}>
                            <h3>Chat</h3>
                            <img src={menos} alt="close" />
                        </div>
                        <div className={`${styles.chatBody} ${isActive ? styles.hide : ""}`}>
                            <h3>Conversa</h3>
                        </div>
                        <div className={`${styles.chatContainerInput} ${isActive ? styles.hide : ""}`}>
                            <div className={styles.chatInput}>
                                <input type="text" placeholder="Send a message"></input>
                                <button>
                                    <img src={pointer} alt="send" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Room;