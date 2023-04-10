import styles from './Home.module.css'
import { Link} from 'react-router-dom';
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
import ModalCriarSala from '../../components/ModalCriarSala';
import ModalEntrarSala from '../../components/ModalEntrarSala';

function Home() {
  const [showCriar, setShowCriar] = useState(false)
  const [showEntrar, setShowEntrar] = useState(false)

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

  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <Link to="/"><h1>TubeSync</h1> </Link>
        </div>
        <div className={styles.headerRight}>
          <a href="#" onClick={() => setShowCriar(true)}>Criar Sala</a>
          <a href="#" onClick={() => setShowEntrar(true)}>Entrar</a>
        </div>
        <ModalCriarSala id="criarSala" isShow={showCriar} setShow={() => setShowCriar(!showCriar)}/>
        <ModalEntrarSala id="showEntrar" isShow={showEntrar} setShow={() => setShowEntrar(!showEntrar)}/>
      </header>
      <div className={styles.banner}>
        <div className={styles.bannerConteudo}>
          <h2 className={styles.bannerTitulo}>
            <span>Convide</span><br></br>
            seus amigos para <br></br>assistir agora!
          </h2>
          <br></br>
          <p>Com o TubeSync você e os convidados podem assistir em sicronia sem interrupções indesejadas e práticas antigas como fazer contagem para iniciar um filme.</p>
          <br></br>
          <br></br>
          <a href="#" onClick={() => setShowCriar(true)} className={styles.bannerButton}>Criar Sala</a>
        </div>
      </div>
      <div className={styles.body} id="body">
        <div className={`${styles.step1} ${styles.step}`}>
          <h2 data-aos="zoom-in">Suportamos Vídeos das seguintes fontes</h2>
          <img src={youtube} alt="youtube" data-aos="zoom-in" />
          <h2 data-aos="zoom-in">O jeito TubeSync de sincronizar</h2>
        </div>
        <div className={`${styles.step2} ${styles.step}`}>
          <div className={styles.container} data-aos="fade-left">
            <div className={styles.stepLeft}>
              <h2>Crie uma Sala</h2>
              <p>No menu do site clique no botão "Criar <br></br>Sala". Na sala criada você pode<br></br> customizar seu nome entre outras <br></br>coisas.</p>
            </div>
            <img src={room} alt="room" />
          </div>
        </div>
        <div className={`${styles.step3} ${styles.step}`}>
          <div className={styles.container} data-aos="fade-right">
            <img src={invite} alt="invite" />
            <div className={styles.stepRight}>
              <h2>Convide seus amigos</h2>
              <p>Estando dentro da sala você pode <br></br>apertar no botão de convidar para enviar<br></br> o link da sala para os seus amigos.</p>
            </div>
          </div>
        </div>
        <div className={`${styles.step4} ${styles.step}`}>
          <div className={styles.container} data-aos="fade-left">
            <div className={styles.stepLeft}>
              <h2>Insira o link do vídeo</h2>
              <p>Na parte inferior do vídeo temos a <br></br> barra de inserção de link. Nesta barra <br></br>você pode inserir o link do vídeo<br></br> desejado para ser exibido para todos<br></br> os usuários da sala.</p>
            </div>
            <img src={search} alt="search" />
          </div>
        </div>
        <div className={`${styles.step5} ${styles.step}`}>
          <div className={styles.container} data-aos="fade-right">
            <img src={sync} alt="sync" />
            <div className={styles.stepRight}>
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
    </>
  );
}

export default Home;
