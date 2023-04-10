import React from 'react';
import styles from '../pages/Room/Room.module.css';
import Card from './Card';


function RoomInfo({isInfo, infoToggle, users}) {
  const lista = users
  
  return (
    <div id="info" className={styles.roomInfo}>
      <div className={styles.infoHeader} onClick={infoToggle}>
        <h3>Room info</h3>
      </div>
      <div className={`${styles.infoBody} ${isInfo ? styles.hide : ""}`}>
        {
          lista && (
            lista.map((elem) =>
              <li><Card nome={elem.username} admin={elem.admin}/></li>
            )
          )
          
        }
      </div>
    </div>
  );
}

export default RoomInfo;