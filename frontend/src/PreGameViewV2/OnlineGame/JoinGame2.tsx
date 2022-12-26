import React from 'react'
import {GameEngineAdapter} from '../../business/GameEngineAdapter'
import {LoadingIndicator} from '../../components/LoadingIndicator'
import {useLobby} from './useLobby'
interface Props {
  name: string
  code: string
  onStartGame(engine: GameEngineAdapter): void
}
export const JoinGame2: React.FC<Props> = ({name, code, onStartGame}) => {
  const lobby = useLobby(code, name, onStartGame)
  if (lobby.loading) return <LoadingIndicator />
  return (
    <div>
      <h3>Players in lobby:</h3>
      <ul>
        {lobby.players.map((player) => (
          <li key={player.name} style={{color: player.color}}>
            {player.name}
          </li>
        ))}
      </ul>
      <hr className="my-4" />
      <p>The host may start the game.</p>
    </div>
  )
}
