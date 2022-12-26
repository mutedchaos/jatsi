import React, {useCallback} from 'react'
import {GameEngineAdapter} from '../../business/GameEngineAdapter'
import {LocalGameEngineAdapter} from '../../business/LocalGameEngineAdapter'
import {PrimaryButton} from '../../components/PrimaryButton'
import {useLocalStoragePersistedState} from '../../hooks/useLocalStoragePersistedState'

import {Player, PlayerList} from './PlayerList'

interface Props {
  onStartGame(engine: GameEngineAdapter): void
}

export const SetupLocalGame: React.FC<Props> = ({onStartGame}) => {
  const [players, setPlayers] = useLocalStoragePersistedState<Player[]>('jatsi-players', [])

  const addPlayer = useCallback(
    (player: Player) => {
      setPlayers((old) => [...old, player])
    },
    [setPlayers]
  )

  const removePlayer = useCallback(
    (player: Player) => {
      setPlayers((old) => old.filter((o) => o !== player))
    },
    [setPlayers]
  )

  const handleStartGame = useCallback(() => {
    const engine = new LocalGameEngineAdapter({
      players,
      rules: {
        variant: 'traditional',
        maxThrows: 3,
      },
    })
    onStartGame(engine)
  }, [onStartGame, players])

  return (
    <div className="container mx-auto">
      <h3>Local Game</h3>
      <p>Add everyone who will be playing, please!</p>
      <PlayerList players={players} onAddPlayer={addPlayer} onRemovePlayer={removePlayer} />
      <div className="mt-6">
        <PrimaryButton disabled={players.length === 0} type="button" onClick={handleStartGame}>
          Start Game
        </PrimaryButton>
      </div>
    </div>
  )
}
