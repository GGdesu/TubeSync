import React from 'react'
import styles from './Modal.module.css';

export default function Modal({id, isShow, setShow, children}){
  const handleOutsideClick = (e) => {
    if(e.target.id === id) setShow()
  }

  if(isShow){
    return(
      <div id={id} onClick={handleOutsideClick} className={styles.overlay}>
        <div className={styles.conteudo}>
            <button onClick={setShow} className={styles.close}>x</button>
            {/* <button onClick={setShow} className={styles.close}>X</button> */}
            {children}
        </div>
      </div>
    )
  }
  return null
}