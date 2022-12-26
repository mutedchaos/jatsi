import React from 'react'
import {GameEngineAdapter} from '../business/GameEngineAdapter'

interface Props {
  onStartGame(engine: GameEngineAdapter): void
}

export const PreGameViewV2: React.FC<Props> = ({onStartGame}) => {
  return null
}
