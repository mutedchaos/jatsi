import {useGameEngine, useGameState} from '../gameContext'

export function useIsLocalPlayerTurn() {
  useGameState() // this ensures re-render when relevant
  const engine = useGameEngine()
  return engine.isLocalPlayerAllowedToAct()
}
