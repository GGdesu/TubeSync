import React from 'react';
import styles from './Card.module.css'
import avatar from '../assets/avatar.png'

const Card = ({nome, admin}) => {
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
                <div className={styles.avatar}><img src={avatar} alt="avatar" /></div>
                <div className={styles.userNome}>{nome}</div>
            </div>
            )
        }  
        </>
    );
}
 
export default Card;