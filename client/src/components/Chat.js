import styles from '../pages/Room/Room.module.css';
import menos from '../assets/menos.png'
import pointer from '../assets/pointer.png'
import React, { useState, useEffect, useRef, useContext } from 'react';
import { SocketContext } from '../context/Socket';


function ChatClient({theaterMode}) {

    const socket = useContext(SocketContext)

    const [isActive, setActive] = useState("false");
    const [messageList, setMessageList] = useState([]);
    const messageRef = useRef();
    const bottomRef = useRef();


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
        clearInput()
        focusInput()
    }

    const clearInput = () => {
        messageRef.current.value = "";
    }

    const focusInput = () => {
        messageRef.current.focus();
    }

    const autoScroll = () => {
        bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }


    useEffect(() => {
        autoScroll()
    }, [messageList]);

    useEffect(() => {
        if (socket) {
            socket.on('responseMessage', data => {
                setMessageList((current) => [...current, data])
            })

            socket.on('userLeaveMsg', name => {
                const notification = { type: 'notification', text: `${name} saiu da sala` };
                setMessageList((current) => [...current, notification])                
                console.log("CHAT: ", name + " saiu da sala")
            })

            socket.on('userJoinMsg', name => {
                const notification = { type: 'notification', text: `${name} entrou na sala` };
                setMessageList((current) => [...current, notification])
                console.log("CHAT: ", name + " entrou na sala")
            })

            /*socket.on("updateUsersRoom", data => {
                console.log("update: ", data)
            })*/
            return () => socket.off('responseMessage')
        }
    }, [socket]);

    return (
        <div id="chat" className={`${styles.chat} ${theaterMode ? styles.chatTheater : ""}`}>
            <div className={styles.chatHeader} onClick={handleToggle}>
                <h3>Chat</h3>
                <img src={menos} alt="close" />
            </div>
            <div className={`${isActive ? styles.hide : ""} ${theaterMode ? styles.chatBodyTheater: styles.chatBody}` }>
                {
                    messageList.map((message, index) => (
                        <>{
                            message.type === 'notification' && (
                                <div className={styles.notification}>{message.text}</div>
                            )}

                            {
                                message.type === 'message' && (
                                    <div className={`${styles["messageContainer"]} ${message.id === socket.id && styles["myMessage"]}`} key={index}>
                                        <div>
                                            <div className={styles.messageAuthor}><strong>{message.id === socket.id ? 'Você' : message.username}</strong></div>
                                            <div>{message.text}</div>
                                            <div className={styles.messageTimestamp}>{message.timestamp}</div>
                                        </div>
                                    </div>
                                    )}
                        </>
                    ))
                }
                <div ref={bottomRef} />
            </div>
            <div className={`${styles.chatContainerInput} ${isActive ? styles.hide : ""}`}>
                <div className={styles.chatInput}>
                    <input type="text" ref={messageRef} placeholder="Send a message" onKeyDown={handleKeyDown}></input>
                    <button onClick={handleSubmit} >

                        <img src={pointer} alt="send" />

                    </button>
                </div>
            </div>
        </div>
    )
}

export default ChatClient;