import React, { useContext, useState } from 'react'
import styles from './Modal.module.css'
import formStyles from '../pages/Home/Home.module.css'
import { SocketContext } from '../context/Socket'
import { useNavigate } from 'react-router-dom'

export default function ModalCriarSala({ id, isShow, setShow}) {
    const [username, setUsername] = useState(null)

    const navigate = useNavigate();

    const handleOutsideClick = (e) => {
        if (e.target.id === id) setShow()
    }

    const socket = useContext(SocketContext)

    const onChangeUsername = (e) => {
        setUsername(e.target.value)
    }

    const criarSala = async (e) => {
        e.preventDefault()
        let response = await socket.emitWithAck("createRoom", username)
        const code = response.roomID
        console.log("codigo da sala: ", code)
        if (response.allow) {
            navigate('/Room', {
                state: {code : code}
            })
        }
    }

    if (isShow) {
        return (
            <div id={id} onClick={handleOutsideClick} className={`${styles.overlay} ${styles.fadeIn}`}>
                <div className={styles.conteudo}>
                    <button onClick={setShow} className={styles.close}>X</button>
                    <form className={formStyles.formModal} onSubmit={criarSala}>
                        <h2 className={formStyles.titulo}>Criar Sala</h2>
                        <input onChange={onChangeUsername} id="nome" placeholder='Seu nome' className={formStyles.input}></input>
                        <button type='submit' className={formStyles.btn}>Criar</button>
                    </form>
                </div>
            </div>
        )
    }
    return null
}