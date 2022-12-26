import {GameState} from '@jatsi/engine'
import React, {useCallback, useState} from 'react'
import {DeleteButton} from '../components/DeleteButton'
import {SecondaryButton} from '../components/SecondaryButton'

export type Player = GameState['players'][number]

interface Props {
  players: Player[]
  onAddPlayer(player: Player): void
  onRemovePlayer(player: Player): void
}

const colors = ['red', 'orange', 'purple', 'green', 'blue', 'black']

export const PlayerList: React.FC<Props> = ({players, onAddPlayer, onRemovePlayer}) => {
  const [newPlayerName, setNewPlayerName] = useState('')
  const handleNewPlayerNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPlayerName(e.target.value)
  }, [])

  const pickColor = useCallback(() => {
    return colors.filter((c) => !players.some((p) => p.color === c))[0]
  }, [players])

  const handleAdd = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      onAddPlayer({name: newPlayerName, color: pickColor()})
      setNewPlayerName('')
    },
    [newPlayerName, onAddPlayer, pickColor]
  )

  return (
    <div>
      <h3 className="separator">Players</h3>
      <div className="separator">
        <ul>
          {players.map((player, i) => (
            <li key={i}>
              <span style={{color: player.color}}>{player.name}</span>{' '}
              <DeleteButton onClick={() => onRemovePlayer(player)} className="ml-3">
                X
              </DeleteButton>
            </li>
          ))}
        </ul>
        {players.length === 0 && <p>No players</p>}
      </div>
      <div className="separator">
        <h4>Add player</h4>
        <form onSubmit={handleAdd}>
          <label>
            Name <input value={newPlayerName} onChange={handleNewPlayerNameChange} autoFocus />{' '}
            <SecondaryButton disabled={newPlayerName.length === 0} type="submit">
              Add
            </SecondaryButton>
          </label>
        </form>
      </div>
    </div>
  )
}
