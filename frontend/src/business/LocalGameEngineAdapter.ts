import {GameEngine, GamePhase, GameState} from '@jatsi/engine'
import {Rules} from '@jatsi/engine/dist/Rules'
import {GameEngineAdapter} from './GameEngineAdapter'

const localStorageKey = 'jatsi-local-game'

export class LocalGameEngineAdapter extends GameEngineAdapter {
  private _gameEngine: GameEngine | null

  private get gameEngine() {
    if (!this._gameEngine) throw new Error('No game engine configured')
    return this._gameEngine
  }

  constructor(initialState?: Pick<GameState, 'players' | 'rules'> | GameState) {
    super()
    this._gameEngine = initialState ? new GameEngine(initialState) : null
    if (initialState) this.attachPersister()
  }

  async prepareRoll(): Promise<number[]> {
    return this.gameEngine.prepareRoll()
  }

  async finishRoll(): Promise<void> {
    return this.gameEngine.finishRoll()
  }

  async toggleDiceLock(diceIndex: number): Promise<void> {
    return this.gameEngine.toggleDiceLock(diceIndex)
  }

  getRules(): Rules {
    return this.gameEngine.rules
  }

  async assignDice(cellId: string): Promise<void> {
    return this.gameEngine.assignDice(cellId)
  }

  getPersistenceData(): unknown {
    return this.gameEngine.gameState
  }

  async tryResume(): Promise<void> {
    const state: GameState | null = JSON.parse(localStorage.getItem(localStorageKey) ?? 'null')
    if (state) {
      if (state.phase === GamePhase.GAMEOVER) throw new Error('Game already over')
      this._gameEngine = new GameEngine(state)
      this.attachPersister()
    }
  }

  async start(): Promise<void> {
    this.gameEngine.start()
  }

  getGameState(): GameState {
    return this.gameEngine.gameState
  }

  private attachPersister() {
    this.gameEngine.onStateUpdated((state) => {
      localStorage.setItem(localStorageKey, JSON.stringify(state))
    })
  }

  onStateUpdated(handler: (gameState: GameState) => void): void {
    this.gameEngine.onStateUpdated(handler)
  }

  offStateUpdated(handler: (gameState: GameState) => void): void {
    this.gameEngine.offStateUpdated(handler)
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function resumeLocalGame(persistenceData: any) {
  return new LocalGameEngineAdapter(persistenceData)
}
