import {GameEngine} from '@jatsi/engine'
import {players, rooms} from '../persistence.js'
import {createEngineForRoom} from './createEngineForRoom.js'
import {updateRoomGameState} from './updateRoomGameState.js'

export async function runEngineOperation(playerId: string, engineFn: (engine: GameEngine) => void | Promise<void>) {
  const player = await players.get(playerId)
  if (!player) throw new Error('Player not found')
  const roomId = player.gameId
  if (!roomId) throw new Error('Player not in game')

  const room = await rooms.get(roomId)
  if (!room) throw new Error('Room not found')

  const currentPlayer = room.gameState?.players[room.gameState?.currentTurn.player]
  if (currentPlayer?.playerId !== playerId) throw new Error('It is not your turn')

  const engine = createEngineForRoom(room)

  await engineFn(engine)
  await updateRoomGameState(room, engine)
}
