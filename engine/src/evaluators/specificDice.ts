import {Evaluator} from '../Evaluator'

export function specificDice(diceValue: number): Evaluator {
  return (dice) => ({
    value: null,
    valueIfSelected: dice.filter((v) => v === diceValue).length * diceValue,
    selectable: true,
  })
}
