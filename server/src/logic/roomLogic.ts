import {randomUUID} from 'crypto'
import {log} from '../log.js'
import {ServerSocket} from '../misc.js'
import {players, Room, rooms} from '../persistence.js'

import {publishRoomStatus} from '../publishRoomStatus.js'

const colors = ['red', 'orange', 'purple', 'green', 'blue', 'black']

export async function createRoom(socket: ServerSocket, playerId: string) {
  const roomId = randomUUID().substring(0, 4)
  log.info(`${playerId} creating room ${roomId}`)
  const room: Room = {
    id: roomId,
    players: [],
    gameState: null,
  }
  await rooms.persist(room)
  await joinRoom(socket, playerId, roomId)
}

export async function joinRoom(socket: ServerSocket, id: string, roomId: string) {
  const player0 = await players.get(id)
  if (player0?.gameId !== roomId) {
    const player = await players.updateViaMutating(id, (player) => {
      player.gameId = roomId
    })

    await rooms.updateViaMutating(roomId, async (room) => {
      room.players.push({
        color: colors.find((c) => room.players.every((p) => p.color !== c)) ?? 'brown',
        name: player.name ?? 'Unknown',
        playerId: id,
      })
    })

    socket.join('room-' + roomId)
  }

  await publishRoomStatus(roomId)
}
