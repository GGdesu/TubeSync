import React, { useContext, useState } from 'react'
import styles from './Modal.module.css';
import formStyles from '../pages/Home/Home.module.css'
import { SocketContext } from '../context/Socket';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { toast } from 'react-hot-toast';


export default function ModalEntrarSala({ id, isShow, setShow }) {
  const [username, setUsername] = useState('');
  const [code, setCode] = useState('');
  const [pin, setPin] = useState()
  const [errors, setErrors] = useState({ username: '', code: '' });

  const socket = useContext(SocketContext);
  const navigate = useNavigate();

  const handleOutsideClick = (e) => {
    if (e.target.id === id) setShow()
  }

  const onChangeUsername = (e) => {
    setUsername(e.target.value)
  }

  const onChangeCode = (e) => {
    setCode(e.target.value)
  }

  const onChangePin = (e) => {
    setPin(e.target.value)
  }

  const validationSchema = yup.object().shape({
    username: yup.string()
    .required('Campo obrigatório')
    .min(2, 'O nome de usuário deve ter pelo menos 2 caracteres.')
    .max(10, 'O nome de usuário não pode ter mais de 10 caracteres.'),
    code: yup.string()
    .required('Campo obrigatório')
    .min(8, 'Formato inválido, o código deve ter 8 caracteres.')
    .max(8, 'Formato inválido, o código deve ter 8 caracteres.'),
  });

  const isAllowed = async (socket) => {
    const validationErrors = {};
    try {
      await validationSchema.validate({ username, code }, { abortEarly: false });
    } catch (err) {
      err.inner.forEach((e) => {
        validationErrors[e.path] = e.message;
      });
      setErrors(validationErrors);
      return;
    }

    const emitResponse = await socket.emitWithAck('joinRoom', {
      roomID: code,
      username: username,
      pin: pin
    })

    return emitResponse
  }

  const entrarSala = async (e) => {
    e.preventDefault()

    let response = await isAllowed(socket)
    console.log("allow? ", response.allow)
    const user = {username: response.username, admin: false}
    if (response.allow) {
      navigate('/room', {
        state: { code: code, pin: pin, user : user }
      })
    } else if (response) {
      toast.error(response.message)
      //alert(response.message)
    }
  }

  return (
    isShow && (
      <div id={id} onClick={handleOutsideClick} className={`${styles.overlay} ${styles.fadeIn}`}>
        <div className={styles.conteudo}>
          <button onClick={setShow} className={styles.close}>x</button>
          <form className={formStyles.formModal} onSubmit={entrarSala}>
            <h2 className={formStyles.titulo}>Entrar em uma Sala</h2>
            <input
              onChange={onChangeUsername}
              placeholder='Seu nome'
              className={formStyles.input}
              value={username}
            />
            {errors.username && (
              <span className={formStyles.error}>{errors.username}</span>
            )}
            <input
              onChange={onChangeCode}
              placeholder='Código da Sala'
              className={formStyles.input}
              value={code}
            />
            {errors.code && (
              <span className={formStyles.error}>{errors.code}</span>
            )}
            <input
              onChange={onChangePin}
              placeholder='Pin da sala'
              className={formStyles.input}
              value={pin}
            />
            <button type='submit' className={formStyles.btn}>Entrar</button>
          </form>
        </div>
      </div>
    )
  );
}