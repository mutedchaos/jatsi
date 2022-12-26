import {Evaluator} from '../Evaluator'
import {sum} from '../utils/sum'

export function anyDice(numberOfDice: number): Evaluator {
  return (dice) => {
    const descendingSortedDice = [...dice].sort().reverse()
    return {selectable: true, value: null, valueIfSelected: sum(descendingSortedDice.slice(0, numberOfDice))}
  }
}
