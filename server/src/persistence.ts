import {Player} from '@jatsi/engine'

interface Room {
  code: string
  players: Player[]
}

const rooms = new Map<string, Room>()

export function createRoom(id: string) {
  rooms.set(id, {
    code: id,
    players: [],
  })
}

export function getRoom(roomId: string) {
  return rooms.get(roomId)
}
