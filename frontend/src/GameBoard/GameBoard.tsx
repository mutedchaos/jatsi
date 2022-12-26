import {GamePhase} from '@jatsi/engine'
import React from 'react'
import {useGameState} from '../gameContext'
import {CurrentTurn} from './CurrentTurn'
import {ScoreBoards} from './ScoreBoards'
import {ScoreSummary} from './ScoreSummary'

export const GameBoard: React.FC = () => {
  const state = useGameState()
  return (
    <div className="container w-full">
      <div className="flex">
        <ScoreBoards />
        <div className="ml-4 mt-7">
          {state.phase !== GamePhase.GAMEOVER ? <CurrentTurn key={state.currentTurn.turn} /> : <ScoreSummary />}
        </div>
      </div>
    </div>
  )
}
