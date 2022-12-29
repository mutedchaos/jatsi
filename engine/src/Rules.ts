import {GameState} from './GameEngine.js'

export interface CellType {
  id: string
  defaultContent: string
  x: number
  y: number
  stateful: boolean
}

export abstract class Rules {
  abstract getCellGrid(): CellType[]
  abstract updateBoardState(gameState: GameState): void
}
