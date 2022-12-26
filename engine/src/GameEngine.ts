import {CellType, Rules} from './Rules'
import {TraditionalRules} from './TraditionalRules'

export interface Cell {
  id: string
  value: number | null
  valueIfSelected: number | null
  selectable: boolean
}

export enum GamePhase {
  PREGAME = 'PREGAME',
  PLAYING = 'PLAYING',
  GAMEOVER = 'GAMEOVER',
}

export interface GameState {
  players: Array<{name: string; color: string}>
  rules: {
    variant: 'traditional'
    maxThrows: number
  }
  boardStateByPlayer: Cell[][]
  phase: GamePhase
  currentTurn: {
    turn: number
    player: number // index
    throws: number[][]
    locked: number[]
  }
}

type UpdateListener = (gameState: GameState) => void

const rulesByVariant = {
  traditional: TraditionalRules,
}

export class GameEngine {
  public readonly gameState: GameState
  private updateListeners: UpdateListener[] = []
  public readonly rules: Rules

  private nextRoll: number[] = []

  constructor(initialState: Pick<GameState, 'players' | 'rules'> | GameState) {
    this.rules = new rulesByVariant[initialState.rules.variant]()
    this.gameState = {
      phase: GamePhase.PREGAME,
      boardStateByPlayer: initialState.players.map(() => initializeStateForPlayer(this.rules.getCellGrid())),
      currentTurn: {
        turn: 0,
        player: 0,
        throws: [],
        locked: [],
      },
      ...initialState,
    }
  }

  public onStateUpdated(handler: UpdateListener) {
    this.updateListeners.push(handler)
  }

  public offStateUpdated(handler: UpdateListener) {
    const index = this.updateListeners.indexOf(handler)
    this.updateListeners.splice(index, 1)
  }

  public start() {
    if (this.gameState.phase !== GamePhase.PREGAME) throw new Error('Invalid state')
    this.gameState.phase = GamePhase.PLAYING
    this.gameState.currentTurn.player = Math.floor(Math.random() * this.gameState.players.length)
    this.startNextTurn()
  }

  private startNextTurn() {
    this.gameState.currentTurn = {
      turn: this.gameState.currentTurn.turn + 1,
      player: (this.gameState.currentTurn.player + 1) % this.gameState.players.length,
      throws: [],
      locked: [],
    }
    this.rules.updateBoardState(this.gameState)

    if (this.detectGameOver()) {
      this.gameState.phase = GamePhase.GAMEOVER
    }
    this.stateUpdated()
  }

  private stateUpdated() {
    for (const handler of this.updateListeners) {
      handler(this.gameState)
    }
  }

  public prepareRoll() {
    if (this.gameState.currentTurn.throws.length >= this.gameState.rules.maxThrows)
      throw new Error('Max throws reached')

    if (this.nextRoll.length) throw new Error('A roll has already been prepared')

    this.nextRoll = [
      this.gameState.currentTurn.locked.includes(0) ? this.latestDice[0] : Math.floor(Math.random() * 6) + 1,
      this.gameState.currentTurn.locked.includes(1) ? this.latestDice[1] : Math.floor(Math.random() * 6) + 1,
      this.gameState.currentTurn.locked.includes(2) ? this.latestDice[2] : Math.floor(Math.random() * 6) + 1,
      this.gameState.currentTurn.locked.includes(3) ? this.latestDice[3] : Math.floor(Math.random() * 6) + 1,
      this.gameState.currentTurn.locked.includes(4) ? this.latestDice[4] : Math.floor(Math.random() * 6) + 1,
    ]

    return [...this.nextRoll]
  }

  public finishRoll() {
    if (!this.nextRoll.length) this.prepareRoll() // allow not preparing

    this.gameState.currentTurn.throws.push(this.nextRoll)
    this.nextRoll = []

    this.rules.updateBoardState(this.gameState)
    this.stateUpdated()
  }

  public get latestDice() {
    if (this.gameState.currentTurn.throws.length) {
      return this.gameState.currentTurn.throws[this.gameState.currentTurn.throws.length - 1]
    }
    return []
  }

  public toggleDiceLock(diceIndex: number) {
    if (this.gameState.currentTurn.throws.length === 0) throw new Error('Cannot lock at this time')
    if (this.gameState.currentTurn.locked.includes(diceIndex)) {
      this.gameState.currentTurn.locked = this.gameState.currentTurn.locked.filter((x) => x !== diceIndex)
    } else {
      this.gameState.currentTurn.locked.push(diceIndex)
    }
    this.stateUpdated()
  }

  public assignDice(id: string) {
    const cell = this.gameState.boardStateByPlayer[this.gameState.currentTurn.player].find((c) => c.id === id)
    if (!cell) throw new Error('Invalid cell')
    if (!cell.selectable) throw new Error('Cell will not accept a value')
    cell.value = cell.valueIfSelected

    this.startNextTurn()
  }

  private detectGameOver() {
    for (const set of this.gameState.boardStateByPlayer) {
      for (const cell of set) {
        if (cell.selectable) return false
      }
    }
    return true
  }

  static resumeFrom(state: GameState) {
    const engine = new GameEngine(state)
    engine.rules.updateBoardState(engine.gameState)
    engine.stateUpdated()
    return engine
  }
}

function initializeStateForPlayer(cellGrid: CellType[]): Cell[] {
  return cellGrid
    .filter((ct) => ct.stateful)
    .map((ct) => ({
      id: ct.id,
      value: null,
      valueIfSelected: null,
      selectable: false,
    }))
}
