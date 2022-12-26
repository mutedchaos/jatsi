import React from 'react'
import {useGameState} from '../gameContext'
import {ScoreBoard} from './ScoreBoard'
export const ScoreBoards: React.FC = () => {
  const state = useGameState()
  return (
    <div>
      <h2>Scores</h2>
      <div className="flex gap-2">
        {state.players.map((_ignored, i) => (
          <ScoreBoard key={i} player={i} />
        ))}
      </div>
    </div>
  )
}
