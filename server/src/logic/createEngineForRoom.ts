import {GameEngine} from '@jatsi/engine'
import {Room} from '../persistence'

export function createEngineForRoom(room: Room): GameEngine {
  if (!room.gameState) throw new Error('No game state in room')

  return GameEngine.resumeFrom(room.gameState)
}
