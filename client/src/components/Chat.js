import styles from '../pages/Room/Room.module.css';
import menos from '../assets/menos.png'
import pointer from '../assets/pointer.png'
import React, { useState, useEffect, useRef } from 'react';
import socketIOClient from "socket.io-client"

const CHAT_ENDPOINT = "http://localhost:4001/chat"

function ChatClient () {

    const [socket, setSocket] = useState(null);
    const [connected, setConnected] = useState(false);
    const [isActive, setActive] = useState("false");
    const [messageList, setMessageList] = useState([]);
    const messageRef = useRef();

    const handleToggle = () => {
        setActive(!isActive);
    };
    
    function handleKeyDown(event) {
        if (event.keyCode === 13) { // código da tecla Enter é 13
            handleSubmit();
        }
      }

    const handleSubmit = () => {
        const message = messageRef.current.value;
        if (!message.trim()) return;

        socket.emit('message', message);
        clearInput();
    }

    const clearInput = () => { 
        messageRef.current.value = "";
    }

    useEffect(() => {
        const newSocket = socketIOClient(CHAT_ENDPOINT);

        newSocket.on('connect', () => {
            console.log("Client: chat Connect!")
            setConnected(true)
        })

        newSocket.on('disconnect', () => {
            console.log("Client: chat Disconnect")
            setConnected(false)
        })

        setSocket(newSocket);

        // Retorna uma função de limpeza que desconecta o socket quando o componente é desmontado
        return () => {
            newSocket.disconnect();
            setSocket(null);
            setConnected(false);
        };
    }, []);

    useEffect(() => { 
        if (socket) {
            socket.on('responseMessage', data => {
                setMessageList((current) => [...current, data])
            })
            return () => socket.off('responseMessage')
        }
    }, [socket]);

    return (
        <div className={styles.chat}>
            <div className={styles.chatHeader} onClick={handleToggle}>
                <h3>Chat</h3>
                <img src={menos} alt="close" />
            </div>
            <div className={`${styles.chatBody} ${isActive ? styles.hide : ""}`}>
                {
                    messageList.map((message, index) => (
                        <p key={index}>{message}<br /></p>
                    ))
                }
            </div>
            <div className={`${styles.chatContainerInput} ${isActive ? styles.hide : ""}`}>
                <div className={styles.chatInput}>
                    <input type="text" ref={messageRef} placeholder="Send a message" onKeyDown={handleKeyDown}></input>
                    <button onClick= {handleSubmit} >
                        
                        <img src={pointer} alt="send" />

                    </button>
                </div>
            </div>
        </div>
    )
}
export default ChatClient;