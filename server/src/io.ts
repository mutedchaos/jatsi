import { ClientToServerEvents, ServerToClientEvents } from "@jatsi/engine"
import { Server } from "socket.io"

let io: Server<ClientToServerEvents, ServerToClientEvents> | null = null

export function setIO(newIO: typeof io) {
  io = newIO
}

export function getIO() {
  if (!io) throw new Error('No io')
  return io
}
