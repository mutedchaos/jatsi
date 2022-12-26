import React, {useCallback} from 'react'
import {GameEngineAdapter} from '../../business/GameEngineAdapter'
import { LoadingIndicator } from '../../components/LoadingIndicator'
import {PrimaryButton} from '../../components/PrimaryButton'
import {useLobby} from './useLobby'
interface Props {
  name: string
  onStartGame(engine: GameEngineAdapter): void
}
export const StartHostingGame: React.FC<Props> = ({name, onStartGame}) => {
  const lobby = useLobby(null, name, onStartGame)

  const startGame = useCallback(() => {
    lobby.startGame()
  }, [lobby])
  
  if (lobby.loading) return <LoadingIndicator />

  return (
    <div>
      <h3>Hosting a game</h3>
      <p className="my-2">
        You may get others to join you by telling them to enter the game with the code <strong>{lobby.code}</strong>
      </p>
      <h3>Players in lobby:</h3>
      <ul>
        {lobby.players.map((player) => (
          <li key={player.name} style={{color: player.color}}>
            {player.name}
          </li>
        ))}
      </ul>
      <hr className="my-4" />
      <PrimaryButton onClick={startGame}>Start game</PrimaryButton>
    </div>
  )
}
