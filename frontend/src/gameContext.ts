import React from "react";
import { GameEngine } from "@jatsi/engine";

export const gameContext = React.createContext<GameEngine | null>(null);
