import React from 'react';
import styles from '../pages/Room/Room.module.css';

function RoomInfo({isInfo, infoToggle }) {
  return (
    <div className={styles.roomInfo}>
      <div className={styles.infoHeader} onClick={infoToggle}>
        <h3>Room info</h3>
      </div>
      <div className={`${styles.infoBody} ${isInfo ? styles.hide : ""}`}>
        <h3>Informações</h3>
      </div>
    </div>
  );
}

export default RoomInfo;