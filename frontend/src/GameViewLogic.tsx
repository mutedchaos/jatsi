import { GameEngine } from "@jatsi/engine";
import { useState } from "react";
import { gameContext } from "./gameContext";
import { PreGameView } from "./PreGameView/PreGameView";
import React from "react";

export const GameViewLogic: React.FC = () => {
  const [gameEngine] = useState<GameEngine | null>(null);

  return (
    <gameContext.Provider value={gameEngine}>
      <PreGameView />
    </gameContext.Provider>
  );
};
