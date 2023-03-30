import styles from './Home.module.css'
import Modal from '../../components/Modal'
import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useContext } from 'react'


import youtube from '../../assets/youtube.png'
import facebook from '../../assets/facebook.png'
import twitter from '../../assets/twitter.png'
import instagram from '../../assets/instagram.png'
import sync from '../../assets/sync.png'
import search from '../../assets/search.png'
import invite from '../../assets/invite.png'
import room from '../../assets/room.png'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { SocketContext } from '../../context/Socket';

function Home() {
  const [showCriar, setShowCriar] = useState(false)
  const [showEntrar, setShowEntrar] = useState(false)

  const [username, setUsername] = useState(null)
  const [code, setCode] = useState(null)

  const [responseReceive, setResponseReceive] = useState(false)


  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 2000 });
  })

  const socket = useContext(SocketContext)


  // Cria o socket uma vez quando o componente é montado
  useEffect(() => {

    socket.on('connect', () => {
      console.log("Client: Connect! " + socket.id)
      //console.log(newSocket)
      //teste para ver se a sala funcionava
      //createRoom(newSocket)
      //setConnected(true)
    })


    socket.on('disconnect', () => {
      console.log("Client: Disconnect! " + socket.id)
      //setConnected(false)
    })
  }, []);

  const onChangeUsername = (e) => {
    setUsername(e.target.value)
  }

  const onChangeCode = (e) => {
    setCode(e.target.value)
  }



  const criarSala = (e) => {
    e.preventDefault()
    socket.emit("createRoom", username)
    navigate('/Room')
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
      navigate('/Room')
    } else {
      alert(response.message)
      
    }
    

  }

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <Link to="/"><h1>TubeSync</h1> </Link>
        </div>
        <div className={styles.headerRight}>
          <a href="#" onClick={() => setShowCriar(true)}>Criar Sala</a>
          <a href="#" onClick={() => setShowEntrar(true)}>Entrar</a>
        </div>
        <Modal id="criarSala" isShow={showCriar} setShow={() => setShowCriar(!showCriar)}>
          <form onSubmit={criarSala}>
            <h2 className={styles.titulo}>Criar Sala</h2>
            <input onChange={onChangeUsername} id="nome" placeholder='Seu nome' className={styles.input}></input>
            <button type='submit' className={styles.btn}>Criar</button>
          </form>
        </Modal>
        <Modal id="showEntrar" isShow={showEntrar} setShow={() => setShowEntrar(!showEntrar)}>
          <form onSubmit={entrarSala}>
            <h2 className={styles.titulo}>Entrar em uma Sala</h2>
            <input onChange={onChangeUsername} placeholder='Seu nome' className={styles.input}></input>
            <input onChange={onChangeCode} placeholder='Código da Sala' className={styles.input}></input>
            <button type='submit' className={styles.btn}>Entrar</button>
          </form>

        </Modal>
      </header>
      <div className={styles.banner}>
        <div className={styles.bannerConteudo}>
          <h2 className={styles.bannerTitulo}>
            <span>Convide</span><br></br>
            seus amigos para <br></br>assistir agora!
          </h2>
          <br></br>
          <p>Com o TubeSync você e os convidados podem assistir em <br></br>sicronia sem interrupções indesejadas e práticas antigas como <br></br>fazer contagem para iniciar um filme.</p>
          <br></br>
          <br></br>
          <Link to="/Room"><a href="" className={styles.bannerButton}>Criar Sala</a></Link>
        </div>
      </div>
      <div className={styles.body} id="body">
        <div className={styles.step1}>
          <h2 data-aos="zoom-in">Suportamos Vídeos das seguintes fontes</h2>
          <img src={youtube} alt="youtube" data-aos="zoom-in" />
          <h2 data-aos="zoom-in">O jeito TubeSync de sincronizar</h2>
        </div>
        <div className={`${styles.step2} ${styles.step}`}>
          <div className={styles.container} data-aos="fade-left">
            <div className={styles.step2Left}>
              <h2>Crie uma Sala</h2>
              <p>No menu do site clique no botão "Criar <br></br>Sala". Na sala criada você pode<br></br> customizar seu nome entre outras <br></br>coisas.</p>
            </div>
            <div className={styles.step2Right}>
              <img src={room} alt="room" />
            </div>
          </div>
        </div>
        <div className={`${styles.step3} ${styles.step}`}>
          <div className={styles.container} data-aos="fade-right">
            <div className={styles.step3Left}>
              <img src={invite} alt="invite" />
            </div>
            <div className={styles.step3Right}>
              <h2>Convide seus amigos</h2>
              <p>Estando dentro da sala você pode <br></br>apertar no botão de convidar para enviar<br></br> o link da sala para os seus amigos.</p>
            </div>
          </div>
        </div>
        <div className={`${styles.step4} ${styles.step}`}>
          <div className={styles.container} data-aos="fade-left">
            <div className={styles.step4Left}>
              <h2>Insira o link do vídeo</h2>
              <p>Na parte inferior do vídeo temos a <br></br> barra de inserção de link. Nesta barra <br></br>você pode inserir o link do vídeo<br></br> desejado para ser exibido para todos<br></br> os usuários da sala.</p>
            </div>
            <div className={styles.step4Right}>
              <img src={search} alt="search" />
            </div>
          </div>
        </div>
        <div className={`${styles.step5} ${styles.step}`}>
          <div className={styles.container} data-aos="fade-right">
            <div className={styles.step5Left}>
              <img src={sync} alt="sync" />
            </div>
            <div className={styles.step5Right}>
              <h2>Assista sincronizado</h2>
              <p>Com tudo finalizado basta você<br></br> descansar e assistir com seus amigos.<br></br>O tubeSync fará a sincronização do<br></br> vídeo automaticamente para você<br></br> através de comandos como play,<br></br> avançar, voltar, pausar entre outros.</p>
            </div>
          </div>
        </div>
      </div>
      <footer className={styles.footer}>
        <h2>TubeSync.</h2>
        <p>Assistindo sincronizado desde 2022!</p>
        <div className={styles.footerImg}>
          <img src={facebook} alt="facebook" />
          <img src={twitter} alt="twitter" />
          <img src={instagram} alt="instagram" />
        </div>
      </footer>
    </div>
  );
}

export default Home;
