import React, {useCallback} from 'react'
import {PrimaryButton} from '../components/PrimaryButton'
import {useLocalStoragePersistedState} from '../hooks/useLocalStoragePersistedState'
import {Player, PlayerList} from './PlayerList'

export const PreGameView: React.FC = () => {
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

  return (
    <div className="container mx-auto">
      <h2>New Game</h2>
      <PlayerList players={players} onAddPlayer={addPlayer} onRemovePlayer={removePlayer} />
      <div className="mt-6">
        <PrimaryButton disabled={players.length === 0} type="button">
          Start Game
        </PrimaryButton>
      </div>
    </div>
  )
}
