import React from 'react'
import {GameEngineAdapter} from '../../business/GameEngineAdapter'
import {useLocalStoragePersistedState} from '../../hooks/useLocalStoragePersistedState'
import {JoinGame} from './JoinGame'
import {StartHostingGame} from './StartHostingGame'

interface Props {
  onStartGame(engine: GameEngineAdapter): void
  host?: boolean
}

export const SetupOnlineGame: React.FC<Props> = ({onStartGame, host}) => {
  const [name, setName] = useLocalStoragePersistedState('jatsi-online-name', '')

  return (
    <div>
      <h2>Online game</h2>
      <div>
        <h3>Enter your name/alias</h3>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <hr className="my-4" />
      {name && host && <StartHostingGame name={name} onStartGame={onStartGame} />}
      {name && !host && <JoinGame name={name} onStartGame={onStartGame} />}
    </div>
  )
}
