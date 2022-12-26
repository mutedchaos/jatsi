declare module 'react-dice-complete' {
  function RDC(props: {
    rollDone?(): void // TODO: has parameters
    numDice?: number
    defaultRoll?: number
    outline?: boolean
    outlineColor?: string
    margin?: number
    faceColor?: string
    dotColor?: string
    dieSize?: number
    rollTime?: number
    disableIndividual?: boolean
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: any
  }): null
  export default RDC
}
