import {useEffect, useState} from 'react'

export function useLocalStoragePersistedState<TState>(
  storageName: string,
  defaultState: TState
): [TState, (newState: TState | ((oldState: TState) => TState)) => void] {
  const [inMemoryState, setInMemoryState] = useState(loadPersistedState<TState>(storageName, defaultState))

  useEffect(() => {
    persistState(storageName, inMemoryState)
  }, [inMemoryState, storageName])

  return [inMemoryState, setInMemoryState]
}

function loadPersistedState<TState>(storageName: string, defaultState: TState) {
  const item = localStorage.getItem(storageName)
  if (!item) return defaultState
  return JSON.parse(item)
}

function persistState(storageName: string, newState: unknown) {
  localStorage.setItem(storageName, JSON.stringify(newState))
}
