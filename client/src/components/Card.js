import React, { useContext } from 'react';
import styles from './Card.module.css'
import avatar from '../assets/avatar.png'
import Modal from './Modal';
import { Link } from 'react-router-dom';
import { SocketContext } from '../context/Socket';

const Card = ({ nome, admin, typeUser }) => {

    const socket = useContext(SocketContext)

    const kickRoom = () => {
        socket.emit("kickUser", nome)

    }

    return (
        <>
            {
                admin ? (
                    <div className={styles.cardAdmin}>
                        <div className={styles.avatar}><img src={avatar} alt="avatar" /></div>
                        <div className={styles.userNomeAdmin}>{nome}</div>
                    </div>
                ) : (

                    <div className={styles.card}>
                        {typeUser && <button onClick={() => kickRoom()} > x </button>}
                        <div className={styles.avatar}><img src={avatar} alt="avatar" /></div>
                        <div className={styles.userNome}>{nome}</div>
                    </div>
                )
            }
        </>
    );
}

export default Card;