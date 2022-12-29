import {log} from './log.js'

import {ServerSocket} from './misc.js'

import {createRoom, joinRoom} from './logic/roomLogic.js'
import {players, rooms} from './persistence.js'
import {startGame} from './logic/startGame.js'
import {publishRoomStatus} from './publishRoomStatus.js'
import {runEngineOperation} from './logic/runEngineOperation.js'

export async function attachSocketListeners(socket: ServerSocket, name: string, id: string) {
  const player = await players.get(id)
  if (!player) {
    await players.persist({id, name, gameId: null})
  } else {
    await players.updateViaMutating(id, (player) => {
      player.name = name
    })
    await socket.join('room-' + player.gameId) // ensure the player exists in the room
  }

  socket.onAny((...args) => log.info('< ', args))
  socket.onAnyOutgoing((msg, arg) => {
    const betterArg = arg && arg.gameState ? 'GAME STATE' : arg
    return log.info('> ', msg, betterArg)
  })

  socket.on('myNameIs', async (newName) => {
    if (typeof newName !== 'string') throw new Error('Invalid arg')
    await handleErrors(async () => {
      const player = await players.updateViaMutating(id, (player) => {
        player.name = newName
      })
      if (player.gameId) {
        await rooms.updateViaMutating(player.gameId, (room) => {
          const roomPlayer = room.players.find((p) => p.playerId === id)
          if (roomPlayer) roomPlayer.name = newName
        })
        await publishRoomStatus(player.gameId)
      }
    })
  })

  socket.on('createRoom', async () => {
    await handleErrors(() => createRoom(socket, id))
  })

  socket.on('joinRoom', async (roomId) => {
    if (typeof roomId !== 'string') throw new Error('Missing room id')
    log.info(`${id} joining room ${roomId}`)
    await handleErrors(() => joinRoom(socket, id, roomId))
  })

  socket.on('startGame', async () => {
    await handleErrors(() => startGame(id))
  })

  socket.on('sendRoom', async () => {
    await handleErrors(async () => {
      const player = await players.get(id)
      if (player?.gameId) {
        const room = await rooms.get(player.gameId)
        if (room) {
          await publishRoomStatus(player.gameId)

          return
        }
      }

      log.info('Disconnecting player: no such game')
      await socket.emit('noSuchGame')
      socket.disconnect()
    })
  })

  socket.on('toggleDiceLock', (dice) => {
    return handleErrors(async () => {
      if (typeof dice !== 'number') throw new Error('Invalid arg')
      await runEngineOperation(id, (engine) => engine.toggleDiceLock(dice))
    })
  })

  socket.on('assignDice', (slot) => {
    return handleErrors(async () => {
      if (typeof slot !== 'string') throw new Error('Invalid arg')
      await runEngineOperation(id, (engine) => engine.assignDice(slot))
    })
  })

  socket.on('finishRoll', () => handleErrors(() => runEngineOperation(id, (engine) => engine.finishRoll())))
  socket.on('prepareRoll', () =>
    handleErrors(() =>
      runEngineOperation(id, async (engine) => {
        const roll = await engine.prepareRoll()
        await socket.emit('rollPrepared', roll)
      })
    )
  )

  async function handleErrors(fn: () => Promise<void>) {
    try {
      await fn()
    } catch (err: any) {
      const errorMessage = err.stack || err.message
      socket.emit('error', errorMessage)
      log.error(errorMessage)
    }
  }
}
