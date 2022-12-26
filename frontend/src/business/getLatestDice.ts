import {GameState} from '@jatsi/engine'

export function getLatestDice(state: GameState) {
  const throws = state.currentTurn.throws
  if (!throws.length) return []
  return throws[throws.length - 1]
}
