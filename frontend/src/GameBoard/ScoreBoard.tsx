import {useGameEngine, useGameState} from '../gameContext'
import React, {useMemo} from 'react'
import {ScoreCellContent} from './ScoreCellContent'

export const ScoreBoard: React.FC<{player: number}> = ({player}) => {
  const state = useGameState()
  const rules = useGameEngine().getRules()
  const grid = useMemo(() => rules.getCellGrid(), [rules])
  const {maxX, maxY} = useMemo(() => {
    const maxX = Math.max(...grid.map((x) => x.x))
    const maxY = Math.max(...grid.map((x) => x.y))

    return {maxX, maxY}
  }, [grid])
  return (
    <div>
      <h3 className="border text-white" style={{background: state.players[player].color}}>
        {state.players[player].name}
      </h3>
      <table>
        <tbody>
          {Array.from({length: maxY + 1}).map((_, y) => (
            <tr key={y}>
              {Array.from({length: maxX + 1}).map((_, x) => (
                <ScoreCellContent key={x} x={x} y={y} grid={grid} player={player} />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
