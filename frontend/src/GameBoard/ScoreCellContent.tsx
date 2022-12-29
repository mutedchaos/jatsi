import {CellType} from '@jatsi/engine/dist/Rules'
import React, {useCallback} from 'react'
import { useIsLocalPlayerTurn } from '../business/useIsLocalPlayerTurn';
import {useGameEngine, useGameState} from '../gameContext'

export const ScoreCellContent: React.FC<{x: number; y: number; grid: CellType[]; player: number}> = ({
  x,
  y,
  grid,
  player,
}) => {
  const state = useGameState()
  const engine = useGameEngine()
  const board = state.boardStateByPlayer[player]

  const gridElement = grid.find((cg) => cg.x === x && cg.y === y)
  const boardElement = gridElement ? board.find((b) => b.id === gridElement.id) : null

  const select = useCallback(() => {
    if (boardElement) {
      engine.assignDice(boardElement.id)
    }
  }, [boardElement, engine])

  const effectiveValueIfSelected =
    boardElement?.valueIfSelected === 0 && state.currentTurn.throws.length === 0
      ? undefined
      : boardElement?.valueIfSelected

  const isLocalPlayerTurn = useIsLocalPlayerTurn()

  return (
    <td
      onClick={boardElement?.selectable && isLocalPlayerTurn ? select : undefined}
      className={`
    border
    min-w-[60px]
    ${!boardElement && 'font-bold'}
    ${boardElement?.value === 0 && 'text-red-400'}
    ${
      state.currentTurn.throws.length > 0 &&
      boardElement?.selectable &&
      boardElement?.valueIfSelected === 0 &&
      'bg-red-100 hover:bg-red-200'
    }
    ${boardElement?.selectable && boardElement?.valueIfSelected && 'bg-green-300 hover:bg-green-400'}
    ${boardElement?.selectable && isLocalPlayerTurn && 'cursor-pointer'}
  `}
    >
      {boardElement?.value ?? effectiveValueIfSelected ?? gridElement?.defaultContent}
    </td>
  )
}
