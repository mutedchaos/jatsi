import {Evaluator} from '../Evaluator'
import {diceValues} from '../misc'

export function sameDice(numberOfDice: number, scoreOverride?: number): Evaluator {
  return (dice) => {
    const validScores = diceValues.map((dv) =>
      dice.filter((d) => d === dv).length >= numberOfDice ? scoreOverride ?? dv * numberOfDice : 0
    )
    const maxScore = Math.max(...validScores)??0
    return {
      value: null,
      valueIfSelected: maxScore,
      selectable: true,
    }
  }
}
