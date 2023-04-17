import React from 'react';
import styles from '../pages/Room/Room.module.css';
import Card from './Card';


function RoomInfo({isInfo, infoToggle, users, typeUser}) {
  const lista = users
  
  return ( 
    <div id="info" className={`${styles.roomInfo} `}>
      <div className={styles.infoHeader} onClick={infoToggle}>
        <h3>informação da sala</h3>
      </div>
      <div className={`${styles.infoBody} ${isInfo ? styles.hide : ""}`}>
        {
          lista && (
            lista.map((elem) =>
              <li><Card nome={elem.username} admin={elem.admin} typeUser={typeUser}/></li>
            )
          )
        }
      </div>
    </div>
  );
}

export default RoomInfo;