import {SOCKET_ENDPOINT} from '../config/Config'
import socketIOClient from "socket.io-client"
import React from 'react'

export const socket = socketIOClient(SOCKET_ENDPOINT)
export const SocketContext = React.createContext()

