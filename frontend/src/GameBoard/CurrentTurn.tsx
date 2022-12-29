/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {useCallback, useEffect, useRef, useState} from 'react'
import {useGameEngine, useGameState} from '../gameContext'
import ReactDice from 'react-dice-complete'
import 'react-dice-complete/dist/react-dice-complete.css'
import {PrimaryButton} from '../components/PrimaryButton'
import {getLatestDice} from '../business/getLatestDice'
import {LocalPlayerTurnOnly} from '../business/LocalPlayerTurnOnly'
import {useIsLocalPlayerTurn} from '../business/useIsLocalPlayerTurn'

export const CurrentTurn: React.FC = () => {
  const state = useGameState()
  const engine = useGameEngine()
  const player = state.players[state.currentTurn.player]

  const [rolled, setRolled] = useState(false)
  const [rolling, setRolling] = useState(false)

  const [shaking, setShaking] = useState(false)

  const activelyRolling = useRef(false)

  const diceRefs = [useRef<any>(null), useRef<any>(null), useRef<any>(null), useRef<any>(null), useRef<any>(null)]

  const rollDice = useCallback(async () => {
    setRolled(true)
    setRolling(true)
    setShaking(false)
    activelyRolling.current = true
    const results = await engine.prepareRoll()
    diceRefs.forEach((dice, i) => {
      if (!state.currentTurn.locked.includes(i)) {
        return dice.current.rollAll([results[i]])
      }
    })
    if (state.currentTurn.locked.length === 5) handleRollDone()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- diceRefs is an odd one here
  }, [engine, state])

  const isLocalPlayerTurn = useIsLocalPlayerTurn()
  useEffect(() => {
    if (!isLocalPlayerTurn && state.currentTurn.preparedThrow.length) {
      setRolled(true)
      diceRefs.forEach((dice, i) => {
        if (!state.currentTurn.locked.includes(i)) {
          return dice.current.rollAll([state.currentTurn.preparedThrow[i]])
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- diceRefs is an odd one here
  }, [isLocalPlayerTurn, state.currentTurn.preparedThrow.length])

  const handleRollDone = useCallback(() => {
    if (rolled && activelyRolling.current) {
      setRolling(false)
      activelyRolling.current = false
      engine.finishRoll()
    }
  }, [engine, rolled])

  const startShaking = useCallback(() => setShaking(true), [])
  const stopShaking = useCallback(() => setShaking(false), [])

  const allThrowsDone = state.currentTurn.throws.length === state.rules.maxThrows
  const canLock = !allThrowsDone && state.currentTurn.throws.length > 0
  return (
    <div className="border-4" style={{borderColor: player.color}}>
      <h2 className="text-white p-2" style={{background: player.color}}>
        <div className="float-right">{state.rules.maxThrows - state.currentTurn.throws.length} roll(s) remaining</div>
        {player.name}
      </h2>
      <div className="flex">
        {Array.from({length: 5}).map((_, i) => (
          <div
            key={i}
            style={{opacity: !rolled && state.currentTurn.throws.length === 0 ? 0.25 : 1, willChange: 'transform'}}
            onClick={!canLock ? undefined : () => engine.toggleDiceLock(i)}
            className={`${!canLock ? '' : 'cursor-pointer'} ${
              shaking && rolled && !rolling && !state.currentTurn.locked.includes(i) ? 'shake' : ''
            }`}
          >
            <ReactDice
              rollDone={handleRollDone}
              ref={diceRefs[i]}
              disableIndividual
              numDice={1}
              faceColor={state.currentTurn.locked.includes(i) ? 'orange' : shaking ? '#edd' : '#eee'}
              dotColor="black"
              rollTime={rolled ? 1 : 0}
              defaultRoll={getLatestDice(state)[i] ?? i + 1}
            />
          </div>
        ))}
        <LocalPlayerTurnOnly>
          <PrimaryButton
            onMouseEnter={startShaking}
            onMouseLeave={stopShaking}
            onClick={rollDice}
            className="ml-6 mr-4 min-w-[100px] self-center"
            disabled={rolling || allThrowsDone}
          >
            Roll {5 - state.currentTurn.locked.length}
          </PrimaryButton>
        </LocalPlayerTurnOnly>
      </div>
    </div>
  )
}
