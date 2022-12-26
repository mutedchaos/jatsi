import React, {useReducer, useState} from 'react'
import {GameEngineAdapter} from '../../business/GameEngineAdapter'
import {SecondaryButton} from '../../components/SecondaryButton'
import { JoinGame2 } from './JoinGame2'

interface Props {
  name: string
  onStartGame(engine: GameEngineAdapter): void
}
export const JoinGame: React.FC<Props> = ({name, onStartGame}) => {
  const [code, setCode] = useState('')
  const [attemptedJoin, joinLobby] = useReducer(() => true, false)
  return (
    <div>
      <h3>Joining a game</h3>
      <p className="my-2">The host needs to provide you with a code, please enter it below.</p>
      <input type="text" value={code} onChange={(e) => setCode(e.target.value)} />
      <SecondaryButton disabled={!code} onClick={joinLobby}>
        Join
      </SecondaryButton>
      {attemptedJoin && <JoinGame2 name={name} code={code} onStartGame={onStartGame} />}
    </div>
  )
}
