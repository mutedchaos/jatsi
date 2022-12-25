import React, { useCallback, useState } from "react";

export interface Player {
  name: string;
  color: string;
}

interface Props {
  players: Player[];
  onAddPlayer(player: Player): void;
  onRemovePlayer(player: Player): void;
}

const colors = ["red", "orange", "purple", "green", "blue", "black"];

export const PlayerList: React.FC<Props> = ({
  players,
  onAddPlayer,
  onRemovePlayer,
}) => {
  const [newPlayerName, setNewPlayerName] = useState("");
  const handleNewPlayerNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setNewPlayerName(e.target.value);
    },
    []
  );

  const pickColor = useCallback(() => {
    return colors.filter((c) => !players.some((p) => p.color === c))[0];
  }, [players]);

  const handleAdd = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault;
      onAddPlayer({ name: newPlayerName, color: pickColor() });
      setNewPlayerName("");
    },
    [newPlayerName, onAddPlayer, pickColor]
  );

  return (
    <div>
      <h3>Players</h3>
      <ul>
        {players.map((player, i) => (
          <li key={i} style={{ color: player.color }}>
            {player.name}{" "}
            <button onClick={() => onRemovePlayer(player)}>X</button>
          </li>
        ))}
      </ul>
      {players.length === 0 && <p>No players</p>}
      <h4>Add player</h4>
      <form onSubmit={handleAdd}>
        <label>
          Name{" "}
          <input value={newPlayerName} onChange={handleNewPlayerNameChange} />{" "}
          <button type="submit">Add</button>
        </label>
      </form>
    </div>
  );
};
