import {GameEngine} from '@jatsi/engine'
import {Room, rooms} from '../persistence.js'
import {publishRoomStatus} from '../publishRoomStatus.js'

export async function updateRoomGameState(room: Room, engine: GameEngine) {
  await rooms.updateViaMutating(room.id, (room) => {
    room.gameState = JSON.parse(JSON.stringify(engine.gameState))
  })
  await publishRoomStatus(room.id)
}
