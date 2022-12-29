import {GameState} from '@jatsi/engine'
import {Rules} from '@jatsi/engine/dist/Rules'

export abstract class GameEngineAdapter {
  abstract prepareRoll(): Promise<number[]>
  abstract finishRoll(): Promise<void>
  abstract toggleDiceLock(diceIndex: number): Promise<void>
  abstract getRules(): Rules
  abstract assignDice(cellId: string): Promise<void>
  abstract getPersistenceData(): unknown
  abstract tryResume(): Promise<void>
  abstract start(): Promise<void>

  abstract onStateUpdated(handler: (gameState: GameState | null) => void): void
  abstract offStateUpdated(handler: (gameState: GameState | null) => void): void
  abstract getGameState(): GameState
  abstract isLocalPlayerAllowedToAct(): boolean
  abstract exit(): Promise<void>
}
