// TODO: There might be some rule variants that should be considered here

import {Evaluator} from '../Evaluator'
import {diceValues} from '../misc'
import {sameDice} from './sameDice'

const viaFourOfKind = sameDice(4)
export const twoPair: Evaluator = (dice, boardState) => {
  // 4 4 4 4 counts as two pairs of 44 and 44
  const fourCase = viaFourOfKind(dice, boardState)
  if (fourCase.valueIfSelected) {
    return fourCase
  }
  const lowPair = diceValues.find((x) => dice.filter((v) => v === x).length >= 2)
  const highPair = [...diceValues].reverse().find((x) => dice.filter((v) => v === x).length >= 2)
  if (!(lowPair && highPair && lowPair !== highPair)) {
    return {selectable: true, value: null, valueIfSelected: 0}
  }

  return {
    selectable: true,
    value: null,
    valueIfSelected: lowPair*2 + highPair*2
  }
}
