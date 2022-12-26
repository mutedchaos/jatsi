import React, {useContext} from 'react'
import {GameEngine, GameState} from '@jatsi/engine'

export const gameContext = React.createContext<GameEngine | null>(null)
export const gameStateContext = React.createContext<GameState | null>(null)

export function useGameState() {
  const value = useContext(gameStateContext)
  if (!value) throw new Error('No game state')
  return value
}

export function useGameEngine() {
  const value = useContext(gameContext)
  if (!value) throw new Error('No game engine')
  return value
}
