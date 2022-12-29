import React, {ReactNode} from 'react'
import {useIsLocalPlayerTurn} from './useIsLocalPlayerTurn'

export const LocalPlayerTurnOnly: React.FC<{children: ReactNode}> = ({children}) => {
  const isLocalPlayerTurn = useIsLocalPlayerTurn()
  if (!isLocalPlayerTurn) return null
  return <>{children}</>
}
