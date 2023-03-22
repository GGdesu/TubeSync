import styles from './Room.module.css'
import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import pesquisar from '../../assets/pesquisar.png'
import settings from '../../assets/settings.png'
import add from '../../assets/add.png'
import YoutubeReact from '../../components/YoutubeReact';
import ChatClient from '../../components/Chat';


function Room() {
    
    const [isInfo, setInfo] = useState("false");
    const [isSettings, setSettings] = useState("false");
    const [isInvite, setInvite] = useState("false");
    const [url, setUrl] = useState("dQw4w9WgXcQ")
    const [inputYtUrl, setInputYtUrl] = useState()

    

    const infoToggle = () => {
        setInfo(!isInfo);
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
                    <ChatClient/>
                </div>
            </div>
        </div>
    );
}

export default Room;