import React, {useMemo} from 'react'
import {useGameState} from '../gameContext'

export const ScoreSummary: React.FC = () => {
  const state = useGameState()
  const playersAndScores = useMemo(() => {
    return state.players
      .map((player, i) => ({
        ...player,
        score: state.boardStateByPlayer[i].find((c) => c.id === 'score')?.value ?? -1,
      }))
      .sort((a, b) => {
        if (a.score === b.score) return a.name.localeCompare(b.name)
        return a.score < b.score ? 1 : -1
      })
  }, [state.boardStateByPlayer, state.players])

  const winners = playersAndScores.filter((pas) => pas.score === playersAndScores[0].score)

  return (
    <div>
      <h2>Game over!</h2>
      <p className="text-lg">
        Winner is:{' '}
        <strong>
          {winners.map((w) => (
            <span key={w.name} style={{color: w.color}}>
              {w.name}{' '}
            </span>
          ))}
        </strong>
        with <strong>54</strong> points!
      </p>
      <p className="mt-4">And overall the scores go like this:</p>
      <ol className="list-decimal ml-4">
        {playersAndScores.map((pas) => (
          <li
            key={pas.name}
            style={{color: pas.color}}
            value={playersAndScores.findIndex((pas2) => pas2.score === pas.score) + 1}
          >
            {pas.name}, with {pas.score} points
          </li>
        ))}
      </ol>
    </div>
  )
}
