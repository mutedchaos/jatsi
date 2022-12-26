import {getIO} from './io'
import {ServerSocket} from './misc'
import {getRoom} from './persistence'
import {getPlayerName} from './playerNames'

export async function joinRoom(socket: ServerSocket, id: string, roomId: string) {
  const room = await getRoom(roomId)
  if (room) {
    socket.join('room-' + roomId)
    room.players.push({color: 'red', name: (await getPlayerName(id)) ?? 'Unknown'})
    console.log('r', room)
    getIO()
      .in('room-' + roomId)
      .emit('roomInfo', room)
  }
}
