import {useCallback, useMemo} from 'react'
import {GameEngineAdapter} from '../business/GameEngineAdapter'
import {LocalGameEngineAdapter} from '../business/LocalGameEngineAdapter'
import {SocketIoGameEngineAdapter} from '../business/SocketIoGameEngineAdapter'
import {useLocalStoragePersistedState} from './useLocalStoragePersistedState'

const knownAdapters = [
  {key: 'local' as const, adapter: LocalGameEngineAdapter},
  {key: 'socketio' as const, adapter: SocketIoGameEngineAdapter},
]

type KnownAdapter = typeof knownAdapters[number]['key']

export function usePersistedEngine(): [null | GameEngineAdapter, (engine: GameEngineAdapter | null) => void] {
  const [variant, setVariant] = useLocalStoragePersistedState<KnownAdapter | null>('jatsi-ongoing-game', null)

  const engine = useMemo(() => {
    if (!variant) return null
    const adapterInfo = knownAdapters.find((ka) => ka.key === variant)
    if (!adapterInfo) return null

    return new adapterInfo.adapter()
  }, [variant])

  const updateEngine = useCallback(
    (engine: GameEngineAdapter | null) => {
      if (!engine) {
        setVariant(null)
      } else {
        const adapterInfo = knownAdapters.find((ka) => engine instanceof ka.adapter)
        if (!adapterInfo) throw new Error('Unknown adapter')

        setVariant(adapterInfo.key)
      }
    },
    [setVariant]
  )

  return [engine, updateEngine]
}
