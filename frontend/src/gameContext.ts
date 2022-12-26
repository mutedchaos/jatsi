import React, {useContext} from 'react'
import {GameState} from '@jatsi/engine'
import {GameEngineAdapter} from './business/GameEngineAdapter'

export const gameEngineContext = React.createContext<GameEngineAdapter | null>(null)
export const gameStateContext = React.createContext<GameState | null>(null)

export function useGameState() {
  const value = useContext(gameStateContext)
  if (!value) throw new Error('No game state')
  return value
}

export function useGameEngine() {
  const value = useContext(gameEngineContext)
  if (!value) throw new Error('No game engine')
  return value
}
