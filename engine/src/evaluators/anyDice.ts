import {Evaluator} from '../Evaluator.js'
import {sum} from '../utils/sum.js'

export function anyDice(numberOfDice: number): Evaluator {
  return (dice) => {
    const descendingSortedDice = [...dice].sort().reverse()
    return {selectable: true, value: null, valueIfSelected: sum(descendingSortedDice.slice(0, numberOfDice))}
  }
}
