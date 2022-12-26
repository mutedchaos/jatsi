import {Player} from './GameEngine'

export interface ServerToClientEvents {
  yourIdIs: (id: string) => void
  roomInfo: (info: {code: string; players: Player[]}) => void
}
export interface ClientToServerEvents {
  myNameIs: (name: string) => void
  createRoom: () => void
  joinRoom: (roomCode: string) => void
}
