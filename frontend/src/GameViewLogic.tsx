import {GameEngine, GamePhase, GameState} from '@jatsi/engine'
import {useCallback, useEffect, useState} from 'react'
import {gameContext, gameStateContext} from './gameContext'
import {PreGameView} from './PreGameView/PreGameView'
import React from 'react'
import {Player} from './PreGameView/PlayerList'
import {useLocalStoragePersistedState} from './hooks/useLocalStoragePersistedState'
import {GameBoard} from './GameBoard/GameBoard'
import {SecondaryButton} from './components/SecondaryButton'

export const GameViewLogic: React.FC = () => {
  const [gameEngine, setGameEngine] = useState<GameEngine | null>(null)
  const [gameState, setGameState] = useLocalStoragePersistedState<GameState | null>('jatsi-state', null)

  const handleStartGame = useCallback((players: Player[]) => {
    const engine = new GameEngine({
      players,
      rules: {
        variant: 'traditional',
        maxThrows: 3,
      },
    })
    engine.start()
    setGameEngine(engine)
  }, [])

  const updateGameState = useCallback(
    (state: GameState) => {
      setGameState(JSON.parse(JSON.stringify(state)))
    },
    [setGameState]
  )

  useEffect(() => {
    if (gameState && !gameEngine) {
      if (gameState.phase !== GamePhase.PLAYING) {
        setGameState(null)
      } else {
        setGameEngine(GameEngine.resumeFrom(gameState))
      }
    }
  }, [gameEngine, gameState, setGameState])

  useEffect(() => {
    if (!gameEngine) return
    gameEngine.onStateUpdated(updateGameState)

    updateGameState(gameEngine.gameState)
    return () => {
      gameEngine.offStateUpdated(updateGameState)
    }
  }, [gameEngine, updateGameState])

  const exit = useCallback(() => {
    setGameState(null)
    setGameEngine(null)
  }, [setGameState])

  if (!gameEngine || !gameState) {
    return <PreGameView onStartGame={handleStartGame} />
  }

  return (
    <gameContext.Provider value={gameEngine}>
      <gameStateContext.Provider value={gameState}>
        <SecondaryButton className="absolute right-2 top-3" onClick={exit}>
          Exit
        </SecondaryButton>
        <GameBoard />
      </gameStateContext.Provider>
    </gameContext.Provider>
  )
}
