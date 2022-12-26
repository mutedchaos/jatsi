import {GameState} from '@jatsi/engine'
import {useCallback, useEffect, useState} from 'react'
import {gameEngineContext, gameStateContext} from './gameContext'
import React from 'react'
import {GameBoard} from './GameBoard/GameBoard'
import {SecondaryButton} from './components/SecondaryButton'
import {GameEngineAdapter} from './business/GameEngineAdapter'
import {usePersistedEngine} from './hooks/usePersistedEngine'
import {LoadingIndicator} from './components/LoadingIndicator'
import {PreGameViewV2} from './PreGameViewV2/PreGameViewV2'

export const GameViewLogic: React.FC = () => {
  const [gameEngine, setGameEngine] = useState<GameEngineAdapter | null>(null)
  const [gameState, setGameState] = useState<GameState | null>(null)

  const [persistedEngine, setPersistedEngine] = usePersistedEngine()
  const [loading, setLoading] = useState(false)
  const handleStartGame = useCallback(
    (engine: GameEngineAdapter) => {
      engine.start()
      setPersistedEngine(engine)
    },
    [setPersistedEngine]
  )

  const updateGameState = useCallback(
    (state: GameState) => {
      setGameState(JSON.parse(JSON.stringify(state)))
    },
    [setGameState]
  )

  useEffect(() => {
    if (persistedEngine && !gameEngine) {
      setLoading(true)
      persistedEngine.tryResume().then(
        () => {
          setGameEngine(persistedEngine)
          setLoading(false)
        },
        () => {
          setPersistedEngine(null)
          setLoading(false)
        }
      )
    }
  }, [gameEngine, gameState, persistedEngine, setGameState, setPersistedEngine])

  useEffect(() => {
    if (!gameEngine) return
    gameEngine.onStateUpdated(updateGameState)

    updateGameState(gameEngine.getGameState())
    return () => {
      gameEngine.offStateUpdated(updateGameState)
    }
  }, [gameEngine, updateGameState])

  const exit = useCallback(() => {
    setPersistedEngine(null)
    setGameState(null)
    setGameEngine(null)
  }, [setPersistedEngine])

  if (loading) return <LoadingIndicator />

  if (!gameEngine || !gameState) {
    return <PreGameViewV2 onStartGame={handleStartGame} />
  }

  return (
    <gameEngineContext.Provider value={gameEngine}>
      <gameStateContext.Provider value={gameState}>
        <SecondaryButton className="absolute right-2 top-3" onClick={exit}>
          Exit
        </SecondaryButton>
        <GameBoard />
      </gameStateContext.Provider>
    </gameEngineContext.Provider>
  )
}
