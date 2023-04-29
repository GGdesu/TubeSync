# TubeSync
>*`Definição:`* Projeto criado na disciplina de Desenvolvimento de aplicações para Web na Universidade Federal Rural de Pernambuco. Este projeto consiste em criar uma aplicação web onde amigos e familiares de diversos lugares do mundo, possam em suas residências se unirem em uma sala virtual para assistirem juntos vídeos compartilhados e sincronizados de forma automática, ou seja, esqueça a velha contagem  "3, 2, 1, vai", na nossa aplicação você não irá precisar disso pois cuidamos dessa funcionalidade pra você, automatizando o envio de comandos para todos os participantes da sala, logo quando um iniciar ou pausar o mesmo acontecerá para os outros, e enquanto isso aproveitem para conversar no nosso bate papo em tempo real.

![banner](https://user-images.githubusercontent.com/51674914/225711573-9621da1e-a429-4796-9cbb-13b9dcb4f102.png)

## Sumário:

- [Stack utilizado](#-stack-utilizado)
- [Clonando projeto](#-clonando-projeto)
- [Instalando pendências](#-instalando-pendências)
- [Startando projeto](#-startando-projeto)
- [Passo a passo](#passo-a-passo)
- [Criando sala](#criando-sala)
- [Convidando amigos](#convidando-amigos)
- [Entrando em Sala](#entrando-em-sala)
- [Autores](#-autores)

## 🛠 Stack utilizado

>Front-end: Utilizamos React JS que é uma biblioteca JavaScript front-end gratuita e de código aberto para criar interfaces de usuário baseadas em componentes. É mantido pela Meta e uma comunidade de desenvolvedores e empresas individuais.

>Back-end: Utilizamos Node JS com a biblioteca socket io, que é uma biblioteca orientada a eventos para aplicativos da Web em tempo real. Ele permite a comunicação bidirecional em tempo real entre clientes e servidores da Web.

## 📋 Clonando projeto
>Para testar nosso projeto, primeiramente teremos que clonar ele.<br>
Portanto, crie uma pasta e abra ele com alguma interface que aceite comandos git, em seguida digite os comandos:

```git
$ git clone https://github.com/GGdesu/TubeSync.git
```

## 🔧 Instalando pendências
>Uma vez clonado o projeto, abra a pasta do projeto e em seguida abra um terminal para digitar o comando que instala as pendências:

```node
npm install
```

## 🚀 Startando projeto
>Com as pendências instaladas, agora precisamos startar o cliente e o servidor.<br>
>Sendo assim, apartir da pasta raiz abra um terminal para cada sessão:

No terminal do cliente, vá para pasta `client` e em seguida dê starte:

```node
cd client
```

```node
npm start
```
No terminal do servidor, vá para pasta `server` e em seguida dê starte:

```node
cd server
```

```node
npm start
```
## Passo a passo
>Aqui segue um vídeo mostrando a inicialização do projeto com o seu funcionamento:

https://user-images.githubusercontent.com/51674914/230800407-a76d61be-a95e-4924-bdf6-1cc22723f874.mp4


## Criando sala
>Para criar uma sala onde será o local em que você assistirá os seus vídeos, basta clicar em `Criar Sala`:

<p align="center">
  <img src="https://user-images.githubusercontent.com/51674914/230799288-bb2a27f8-c269-4c6c-ac31-ce97a3e74b7c.gif" alt="animated" />
</p>

## Convidando amigos
>Uma vez criado a sala, você pode passar o código da sala para os seus amigos que fica no ícone superior a direita:

<p align="center">
  <img src="https://user-images.githubusercontent.com/51674914/230799624-b415010e-5915-4bd5-91b1-6a9453b6b5ac.gif" alt="animated" />
</p>

## Entrando em Sala
>Caso algum amigo seu tenha criado a sala, você pode entrar na sala clicando em `Entrar` e em seguida preenchendo seu nome e colocando o código da sala do seu amigo:

<p align="center">
  <img src="https://user-images.githubusercontent.com/51674914/230800202-c56d364c-e3f0-4c2c-9667-0023798299ce.gif" alt="animated" />
</p>

## ✒ Autores

- Gabriel Gomes
- Mateus Wei
- Pedro Mesquita
- Rafael Matos
- Ravi Lucena



