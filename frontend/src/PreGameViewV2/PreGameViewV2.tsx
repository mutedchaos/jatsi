import React, {useCallback} from 'react'
import {GameEngineAdapter} from '../business/GameEngineAdapter'
import {useLocalStoragePersistedState} from '../hooks/useLocalStoragePersistedState'
import {SetupLocalGame} from './LocalGame/SetupLocalGame'
import {SetupOnlineGame} from './OnlineGame/SetupOnlineGame'

interface Props {
  onStartGame(engine: GameEngineAdapter): void
}

export const PreGameViewV2: React.FC<Props> = ({onStartGame}) => {
  const [gameType, setGameType] = useLocalStoragePersistedState<'local' | 'online-host' | 'online-join'>(
    'jatsi-game-type',
    'local'
  )

  const setLocal = useCallback(() => setGameType('local'), [setGameType])
  const setOnlineHost = useCallback(() => setGameType('online-host'), [setGameType])
  const setOnlineJoin = useCallback(() => setGameType('online-join'), [setGameType])

  return (
    <div className="container mx-auto">
      <h2>How do you want to play?</h2>
      <div>
        <label>
          <input type="radio" checked={gameType === 'local'} onClick={setLocal} name="type" value="local" /> Locally, on
          this computer/phone/device!
        </label>
      </div>
      <div>
        <label>
          <input
            type="radio"
            checked={gameType === 'online-host'}
            onClick={setOnlineHost}
            name="type"
            value="online-host"
          />
          I want to host an online game!
        </label>
      </div>
      <div>
        <label>
          <input
            type="radio"
            checked={gameType === 'online-join'}
            onClick={setOnlineJoin}
            name="type"
            value="online-join"
          />
          I want to join an online game!
        </label>
      </div>
      <hr className="my-4" />
      {gameType === 'local' ? (
        <SetupLocalGame onStartGame={onStartGame} />
      ) : (
        <SetupOnlineGame host={gameType === 'online-host'} onStartGame={onStartGame} />
      )}
    </div>
  )
}
