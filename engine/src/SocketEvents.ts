import {GameState, Player} from './GameEngine.js'

export interface RoomInfo {
  id: string
  players: Player[]
  gameState: GameState | null
}

export interface ServerToClientEvents {
  yourIdIs: (id: string) => void
  roomInfo: (info: RoomInfo) => void
  error: (message: string) => void
  rollPrepared: (dice: number[]) => void
  noSuchGame: () => void
}

export interface ClientToServerEvents {
  myNameIs: (name: string) => void
  createRoom: () => void
  joinRoom: (roomCode: string) => void
  startGame: () => void
  sendRoom: () => void
  toggleDiceLock: (diceIndex: number) => void
  assignDice: (slot: string) => void
  finishRoll: () => void
  prepareRoll: () => void
}
