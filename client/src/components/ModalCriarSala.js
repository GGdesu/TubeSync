import React, { useContext, useState } from 'react'
import styles from './Modal.module.css'
import formStyles from '../pages/Home/Home.module.css'
import { SocketContext } from '../context/Socket'
import { useNavigate } from 'react-router-dom'
import * as yup from 'yup';

export default function ModalCriarSala({ id, isShow, setShow}) {
    
    const validation = yup.object().shape({
        username: yup.string()
            .required('Campo obrigatório.')
            .min(2, 'O nome de usuário deve ter pelo menos 2 caracteres.')
            .max(10, 'O nome de usuário não pode ter mais de 10 caracteres.')
    })
    
    const [username, setUsername] = useState('')
    const [error, setError] = useState(null)
    const navigate = useNavigate();

    const handleOutsideClick = (e) => {
        if (e.target.id === id) setShow()
    }

    const socket = useContext(SocketContext)

    const onChangeUsername = (e) => {
        setUsername(e.target.value.replace(/[\W_]+/g, ''));
        setError(null)
    }

    const criarSala = async (e) => {
        e.preventDefault()
        try {
            await validation.validate({ username })
            let response = await socket.emitWithAck("createRoom", username)
            const code = response.roomID
            const pin = response.pin
            const user = {username: username, admin : true}
            console.log("codigo da sala: ", code)
            console.log("pin da sala: ", pin)
            if (response.allow) {
                navigate('/Room', {
                    state: {code : code, pin : pin, user : user}
                })
            }
        } catch (err) {
            setError(err.errors[0])
        }
    }

    if (isShow) {
        return (
            <div id={id} onClick={handleOutsideClick} className={`${styles.overlay} ${styles.fadeIn}`}>
                <div className={styles.conteudo}>
                    <button onClick={setShow} className={styles.close}>x</button>
                    <form className={formStyles.formModal} onSubmit={criarSala}>
                        <h2 className={formStyles.titulo}>Criar Sala</h2>
                        <input onChange={onChangeUsername} id="nome" placeholder='Seu nome' autocomplete="off" className={formStyles.input}></input>
                        {error && <span className={formStyles.error}>{error}</span>}
                        <button type='submit' className={formStyles.btn}>Criar</button>
                    </form>
                </div>
            </div>
        )
    }
    return null
}