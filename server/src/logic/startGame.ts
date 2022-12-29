import {GameEngine} from '@jatsi/engine'
import {players, rooms} from '../persistence.js'
import {updateRoomGameState} from './updateRoomGameState.js'

export async function startGame(playerId: string) {
  const player = await players.get(playerId)
  if (!player) throw new Error('Missing player')

  if (!player.gameId) throw new Error('Player has no game')

  const room = await rooms.get(player.gameId)

  if (!room) throw new Error('Room not found')
  if (room.players[0].playerId !== playerId) throw new Error('Only the host may start the game')

  if (room.gameState) throw new Error('Game already ongoing.')

  const engine = new GameEngine({
    players: room.players,
    rules: {
      variant: 'traditional',
      maxThrows: 3,
    },
  })
  await engine.start()

  await updateRoomGameState(room, engine)
}
