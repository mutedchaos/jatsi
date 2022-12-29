import {GameState, Player} from '@jatsi/engine'
import {log} from './log.js'
import fs from 'fs'

export interface Room {
  id: string
  players: Player[]
  gameState: null | GameState
}

export interface PlayerInfo {
  id: string
  name: string
  gameId: string | null
}

export const rooms = createPersistence<Room>('room')
export const players = createPersistence<PlayerInfo>('player')

function createPersistence<TData extends {id: string}>(entityType: string) {
  return {
    async get(id: string): Promise<null | TData> {
      try {
        const fn = getFilename(entityType, id)

        return JSON.parse(await fs.promises.readFile(fn, 'utf-8'))
      } catch (err: any) {
        log.error(err.stack || err.message || err)
        return null
      }
    },

    async persist(entity: TData) {
      const fn = getFilename(entityType, entity.id)
      await fs.promises.writeFile(fn, JSON.stringify(entity, null, 2), 'utf-8')
    },

    async updateViaMutating(id: string, mutator: (entity: TData) => void | Promise<void>) {
      const entity = await this.get(id)
      if (!entity) throw new Error('Failed to find entity')
      await mutator(entity)
      await this.persist(entity)
      return entity
    },
  }
}

function getFilename(entityType: string, entityId: string) {
  if (!entityId.match(/^[a-zA-Z0-9-]{1,64}$/)) throw new Error('Invalid room id ' + entityId)
  return new URL('../../data/' + entityType + '-' + entityId + '.json', import.meta.url)
}
