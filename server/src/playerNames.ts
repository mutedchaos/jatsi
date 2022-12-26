const playerNames = new Map<string, string>()

export function setPlayerName(id: string, name: string) {
  playerNames.set(id, name)
}

export function getPlayerName(id: string) {
  return playerNames.get(id)
}
