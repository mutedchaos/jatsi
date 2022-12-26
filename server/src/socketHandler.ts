import {randomUUID} from 'crypto'

import {ServerSocket} from './misc'
import {createRoom} from './persistence'
import {setPlayerName} from './playerNames'
import {joinRoom} from './roomLogic'

export function attachSocketListeners(socket: ServerSocket, name: string, id: string) {
  setPlayerName(id, name)
  socket.on('createRoom', async () => {
    const roomId = randomUUID().substring(0, 4)
    console.log(`${id} creating room ${roomId}`)
    await createRoom(roomId)
    await joinRoom(socket, id, roomId)
  })

  socket.on('joinRoom', async (roomId) => {
    console.log(`${id} joining room ${roomId}`)
    await joinRoom(socket, id, roomId)
  })
}
