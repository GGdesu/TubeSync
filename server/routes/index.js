//o arquivo index.js define uma rota para o Express que é usada como middleware no arquivo app.js
//que responde com um objeto JSON contendo uma mensagem "I am alive" quando um cliente faz uma solicitação HTTP GET para o caminho raiz "/".
import express from "express"

const router = express.Router()

//uma rota muito simples para ouvir qualquer conexão de entrada.
router.get("/", (req, res) => {
    res.send({response: "I am Alive"}).status(200)
})


export default router