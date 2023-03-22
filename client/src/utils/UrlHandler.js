


function ytUrlHandler (urlYt) {

    if(!urlYt.includes("youtube.com") && !urlYt.includes("youtu.be")){
        console.log("ERRO: Link inválido!")
        return ""
    }

    //tamanho do VIDEO ID
    let ytIDLen = 11
    //dominio do url quando é usada a opção de compartilhar
    let ytShareUrlDomain = 'youtu.be'
    //indice do inicio do video ID
    let idStart
    
    if(urlYt.includes(ytShareUrlDomain)){
        idStart = urlYt.lastIndexOf('/')
        idStart = idStart === -1 ? idStart : idStart +=1
    }else{
        idStart = urlYt.indexOf('?v=')
        idStart = idStart === -1 ?  -1 : idStart +=3
    }

    let videoId = urlYt.substr(idStart, ytIDLen)
    if(videoId.length < ytIDLen){
        console.log("VideoID está incompleto")
        return ""
      }
    //console.log(videoId)

    return videoId

}

export default ytUrlHandler