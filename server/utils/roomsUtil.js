//refatorar depois, para uma boa pratica, criar funções auxiliares que irao encapsular a logica
// para modificar a variavel rooms, e depois chamar elas nos eventos

import { generateId } from "./Util.js"

const createRoomPin = (rooms, roomID) => {
    try {
        const pin = generateId(4)
        rooms[roomID].pin = pin
        console.log("pin criado ", pin)
        return pin

    } catch (error) {
        console.log("erro ao tentar criar um PIN ", error)
    }
}

const updateRoomPin = (rooms, roomID) => {
    try {
        let pin = generateId(4)
        while(pin === rooms[roomID].pin){  pin = generateId(4) }
        
        rooms[roomID].pin = pin
        console.log("pin atualizado ", pin)
        return pin

    } catch (error) {
        console.log("erro ao tentar atualizar o pin", error)
    }
}

const getRoomPin = (rooms, roomID) => {
    try {
        console.log("pin da sala: ", rooms[roomID].pin)
        return rooms[roomID].pin
    } catch (error) {
        console.log("não foi possivel pegar o pin da sala ", error)
        
    }
}

export {
    createRoomPin,
    updateRoomPin,
    getRoomPin
}