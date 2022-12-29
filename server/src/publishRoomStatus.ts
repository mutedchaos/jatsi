import {getIO} from './io.js'
import {rooms} from './persistence.js'

export async function publishRoomStatus(roomId: string) {
  const room = await rooms.get(roomId)
  if (!room) throw new Error('Room not found')
  getIO()
    .in('room-' + roomId)
    .emit('roomInfo', room)
}
