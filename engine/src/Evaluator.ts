import {Cell} from './GameEngine.js'

export type Evaluator = (dice: number[], boardState: Cell[]) => Omit<Cell, 'id'>
