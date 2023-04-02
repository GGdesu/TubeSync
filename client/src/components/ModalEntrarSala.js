import React, { useContext, useState } from 'react'
import styles from './Modal.module.css';
import formStyles from '../pages/Home/Home.module.css'
import { SocketContext } from '../context/Socket';
import { useNavigate } from 'react-router-dom';

export default function ModalEntrarSala({id, isShow, setShow}){
  const [username, setUsername] = useState(null)
  const [code, setCode] = useState(null)

  const socket = useContext(SocketContext)
  const navigate = useNavigate();
  
  const handleOutsideClick = (e) => {
    if(e.target.id === id) setShow()
  }

  const onChangeUsername = (e) => {
    setUsername(e.target.value)
  }

  const onChangeCode = (e) => {
    setCode(e.target.value)
  }

  const isAllowed = async (socket) => {
    let emitResponse = await socket.emitWithAck("joinRoom", {
      roomID: code,
      username: username
    })

    return emitResponse


  }

  const entrarSala = async (e) => {
    
    e.preventDefault()

    let response = await isAllowed(socket)
    console.log("allow?", response.allow)
    
    if (response.allow) {
      navigate('/Room', {code})
    } else {
      alert(response.message)
      
    }
    

  }
  
  if(isShow){
    return(
      <div id={id} onClick={handleOutsideClick} className={`${styles.overlay} ${styles.fadeIn}`}>
        <div className={styles.conteudo}>
          <button onClick={setShow} className={styles.close}>X</button>
          <form className={formStyles.formModal} onSubmit={entrarSala}>
            <h2 className={formStyles.titulo}>Entrar em uma Sala</h2>
            <input onChange={onChangeUsername} placeholder='Seu nome' className={formStyles.input}></input>
            <input onChange={onChangeCode} placeholder='Código da Sala' className={formStyles.input}></input>
            <button type='submit' className={formStyles.btn}>Entrar</button>
          </form>
        </div>
      </div>
    )
  }
  return null
}