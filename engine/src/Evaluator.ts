import {Cell} from './GameEngine'

export type Evaluator = (dice: number[], boardState: Cell[]) => Omit<Cell, 'id'>
