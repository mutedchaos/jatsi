import {Evaluator} from '../Evaluator'
import { sum } from '../utils/sum'

export function straight(startingFrom: number): Evaluator {
  const expectedDice = [1, 2, 3, 4, 5].map((x) => x + startingFrom - 1)
  const value = sum(expectedDice)
  return (dice) => {
    const hasStraight = expectedDice.every((d) => dice.includes(d))
    return {
      value: null,
      valueIfSelected: hasStraight ? value : 0,
      selectable: true,
    }
  }
}
