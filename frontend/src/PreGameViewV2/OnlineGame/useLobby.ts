import {GameEngineAdapter} from '../../business/GameEngineAdapter'
import {io, Socket} from 'socket.io-client'
import {useCallback, useEffect, useMemo, useState} from 'react'
import {useLocalStoragePersistedState} from '../../hooks/useLocalStoragePersistedState'
import {ClientToServerEvents, Player, RoomInfo, ServerToClientEvents} from '@jatsi/engine'
import {SocketIoGameEngineAdapter} from '../../business/SocketIoGameEngineAdapter'

export function useLobby(lobbyCode: null | string, name: string, onStartGame: (engine: GameEngineAdapter) => void) {
  const [myId, setMyId] = useLocalStoragePersistedState<{id: string | null}>('online-id', {id: null})
  const [createdLobbyCode, setCreatedLobbyCode] = useState('')
  const [connected, setConnected1] = useState(false)
  const [players, setPlayers] = useState<Player[]>([])
  const socket = useMemo(() => {
    const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io('ws://localhost:3777', {
      reconnectionDelayMax: 10000,
      query: {
        name,
        ...(myId.id ? {id: myId.id} : {}),
      },

      autoConnect: false,
    })
    return socket
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    socket.emit('myNameIs', name)
  }, [name, socket])

  useEffect(() => {
    return () => {
      socket.disconnect()
    }
  }, [socket])

  const setConnected = useCallback(() => {
    setConnected1(true)
  }, [])
  const setDisconnected = useCallback(() => {
    setConnected1(false)
  }, [])

  useEffect(() => {
    socket.on('yourIdIs', (id) => {
      setMyId({id})
    })
    socket.on('error', (message) => {
      alert(message)
    })
  }, [setMyId, socket])

  useEffect(() => {
    const hook = (roomInfo: RoomInfo) => {
      if (!lobbyCode) setCreatedLobbyCode(roomInfo.id)
      setPlayers(roomInfo.players)

      //console.log('x', name, myId, Boolean(roomInfo.gameState))

      if (roomInfo.gameState) {
        if (!myId.id) throw new Error('Invalid state')
        onStartGame(new SocketIoGameEngineAdapter({name, playerId: myId.id}))
      }
    }
    socket.on('roomInfo', hook)
    return () => {
      socket.off('roomInfo', hook)
    }
  }, [lobbyCode, myId, name, onStartGame, socket])

  useEffect(() => {
    if (!connected) return
    if (lobbyCode) {
      socket.emit('joinRoom', lobbyCode)
    } else {
      socket.emit('createRoom')
    }
  }, [connected, lobbyCode, socket])

  const startGame = useCallback(() => {
    socket.emit('startGame')
  }, [socket])

  useEffect(() => {
    socket.on('connect', setConnected)
    socket.on('connect_error', (err) => alert(err.message))
    socket.on('disconnect', setDisconnected)
    socket.connect()
    return () => {
      socket.off('connect', setConnected)
      socket.off('disconnect', setDisconnected)
    }
  }, [setConnected, setDisconnected, socket])

  return {
    loading: (!lobbyCode && !createdLobbyCode) || !players.length,
    players,
    code: createdLobbyCode || lobbyCode,
    startGame,
  }
}
