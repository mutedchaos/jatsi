// TODO: There might be some rule variants that should be considered here

import {Evaluator} from '../Evaluator'
import {sum} from '../utils/sum'

export const fullHouse: Evaluator = (dice) => {
  const sortedDice = [...dice].sort()
  const hasFullHouse =
    (sortedDice[0] === sortedDice[2] && sortedDice[3] === sortedDice[4]) ||
    (sortedDice[0] === sortedDice[1] && sortedDice[2] === sortedDice[4])

  return {
    selectable: true,
    value: null,
    valueIfSelected: hasFullHouse ? sum(dice) : 0,
  }
}
