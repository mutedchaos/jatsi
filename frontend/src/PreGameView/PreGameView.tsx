import React, { useCallback, useState } from "react";
import { PrimaryButton } from "../components/PrimaryButton";
import { Player, PlayerList } from "./PlayerList";

export const PreGameView: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);

  const addPlayer = useCallback((player: Player) => {
    setPlayers((old) => [...old, player]);
  }, []);

  const removePlayer = useCallback((player: Player) => {
    setPlayers((old) => old.filter((o) => o !== player));
  }, []);

  return (
    <div className="container mx-auto">
      <h1>Jatsi</h1>
      <h2>New Game</h2>
      <PlayerList
        players={players}
        onAddPlayer={addPlayer}
        onRemovePlayer={removePlayer}
      />
      <PrimaryButton type="button">Start Game</PrimaryButton>
    </div>
  );
};
