import {randomUUID} from 'crypto'
import {createServer} from 'http'
import {Server} from 'socket.io'
import {log} from './log.js'
import {attachSocketListeners} from './socketHandler.js'
import {ClientToServerEvents, ServerToClientEvents} from '@jatsi/engine'
import {setIO} from './io.js'

const httpServer = createServer()
const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
})

io.on('connection', async (socket) => {
  try {
    const {name, id} = socket.handshake.query as {name?: string; id?: string}
    if (id === 'undefined' || id === 'null') throw new Error('Your id cannot be the string undefined or null')
    const realId = id ?? randomUUID()
    log.info('Connection for ', {name, id, realId})
    await attachSocketListeners(socket, name ?? randomUUID(), realId)
    if (!id) {
      socket.emit('yourIdIs', realId)
    }
  } catch (err: any) {
    log.error(err.stack)
    socket.disconnect(true)
  }
})

httpServer.listen(3777)

setIO(io)
log.info('Server running.')
