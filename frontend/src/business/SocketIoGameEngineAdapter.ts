import {GameEngineAdapter} from './GameEngineAdapter'
import {io, Socket} from 'socket.io-client'
import {ClientToServerEvents, GameEngine, GameState, ServerToClientEvents} from '@jatsi/engine'
import {delay} from '../delay'
import {Rules} from '@jatsi/engine/dist/Rules'

interface Data {
  name: string
  playerId: string
}

export class SocketIoGameEngineAdapter extends GameEngineAdapter {
  private data: Data | null = null
  private _socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null

  gameNotFound = false
  private stateHooks: Array<(gameState: GameState | null) => void> = []

  latestState: GameState | null = null
  preparedRoll: number[] | null = null

  constructor(data?: Data) {
    super()
    if (data) {
      this.data = data
      this.connect()
      localStorage.setItem('jatsi-sio-game', JSON.stringify(data))
    }
  }

  onStateUpdated(handler: (gameState: GameState | null) => void): void {
    this.stateHooks.push(handler)
  }

  offStateUpdated(handler: (gameState: GameState | null) => void): void {
    const index = this.stateHooks.indexOf(handler)
    this.stateHooks.splice(index, 1)
  }

  async start(): Promise<void> {
    while (!this.latestState && !this.gameNotFound) {
      await delay(100)
    }
    if (this.gameNotFound) throw new Error('Game not found')
  }

  getGameState(): GameState {
    if (!this.latestState) throw new Error('Game state is not available')
    return this.latestState
  }

  async assignDice(cellId: string): Promise<void> {
    this.socket.emit('assignDice', cellId)
  }

  async finishRoll(): Promise<void> {
    this.socket.emit('finishRoll')
  }

  async prepareRoll(): Promise<number[]> {
    this.preparedRoll = null
    this.socket.emit('prepareRoll')
    while (!this.preparedRoll) {
      await delay(10)
    }
    return this.preparedRoll
  }

  getPersistenceData(): unknown {
    return null
  }

  getRules(): Rules {
    if (!this.latestState) throw new Error('Rules not available at this time')
    return GameEngine.resumeFrom(this.latestState).rules
  }

  async toggleDiceLock(diceIndex: number): Promise<void> {
    this.socket.emit('toggleDiceLock', diceIndex)
  }

  async tryResume(): Promise<void> {
    const data: Data | null = JSON.parse(localStorage.getItem('jatsi-sio-game') || 'null')
    this.data = data
    if (this.data) {
      await this.connect()
      await this.start()
    }
  }

  private connect() {
    if (!this.data) throw new Error('Cannot connect at this time')
    if (!this.data.playerId) throw new Error('Cannot connect without a player id')
    this._socket = io('ws://localhost:3777', {
      reconnectionDelayMax: 10000,
      query: {
        name: this.data.name,
        id: this.data.playerId,
      },
    })

    this.socket.on('roomInfo', (room) => {
      this.latestState = room.gameState
      if (room.gameState) {
        for (const hook of this.stateHooks) {
          hook(room.gameState)
        }
      }
    })

    this.socket.on('error', (message) => {
      alert(message)
    })

    this.socket.on('rollPrepared', (dice) => {
      this.preparedRoll = dice
    })

    this.socket.on('noSuchGame', () => {
      this.gameNotFound = true
      for (const handler of this.stateHooks) {
        handler(null)
      }
    })

    this.socket.emit('sendRoom')
  }

  private get socket() {
    if (!this._socket) throw new Error('Socket not available at this time')
    return this._socket
  }

  isLocalPlayerAllowedToAct(): boolean {
    if (!this.latestState) return false
    return this.latestState.players[this.latestState.currentTurn.player].playerId === this.data?.playerId
  }

  async exit(): Promise<void> {
    await this.socket.emit('exit')
    await this.socket.disconnect()
  }
}
