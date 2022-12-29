import {Evaluator} from './Evaluator.js'
import {anyDice} from './evaluators/anyDice.js'
import {fullHouse} from './evaluators/fullHouse.js'
import {sameDice} from './evaluators/sameDice.js'
import {specificDice} from './evaluators/specificDice.js'
import {straight} from './evaluators/straight.js'
import {twoPair} from './evaluators/twoPair.js'
import {Cell, GameState} from './GameEngine.js'
import {CellType, Rules} from './Rules.js'
import {sum} from './utils/sum.js'

interface ExtendedCellType extends CellType {
  evaluator: Evaluator | null
  evaluateAlways?: boolean
}

const traditionalTopScore: Evaluator = (_dice, boardState) => {
  const earned =
    valueOf(boardState, 'ones') +
    valueOf(boardState, 'twos') +
    valueOf(boardState, 'threes') +
    valueOf(boardState, 'fours') +
    valueOf(boardState, 'fives') +
    valueOf(boardState, 'sixes')

  return {
    selectable: false,
    value: earned,
    valueIfSelected: null,
  }
}

const topBonusTraditional: Evaluator = (_dice, boardState) => {
  return {
    selectable: false,
    value: valueOf(boardState, 'topscore') >= 63 ? 50 : 0,
    valueIfSelected: null,
  }
}

const traditionalTotalScore: Evaluator = (_dice, boardState) => {
  return {
    selectable: false,
    value: sum(boardState.filter((x) => !x.id.includes('score')).map((x) => x.value ?? 0)),
    valueIfSelected: null,
  }
}

const cellGrid = [
  {x: 0, y: 0, defaultContent: 'Ones', stateful: false, id: 'label-ones', evaluator: null},
  {x: 1, y: 0, defaultContent: '', stateful: true, id: 'ones', evaluator: specificDice(1)},

  {x: 0, y: 1, defaultContent: 'Twos', stateful: false, id: 'label-twos', evaluator: null},
  {x: 1, y: 1, defaultContent: '', stateful: true, id: 'twos', evaluator: specificDice(2)},

  {x: 0, y: 2, defaultContent: 'Threes', stateful: false, id: 'label-threes', evaluator: null},
  {x: 1, y: 2, defaultContent: '', stateful: true, id: 'threes', evaluator: specificDice(3)},

  {x: 0, y: 3, defaultContent: 'Fours', stateful: false, id: 'label-fours', evaluator: null},
  {x: 1, y: 3, defaultContent: '', stateful: true, id: 'fours', evaluator: specificDice(4)},

  {x: 0, y: 4, defaultContent: 'Fives', stateful: false, id: 'label-fives', evaluator: null},
  {x: 1, y: 4, defaultContent: '', stateful: true, id: 'fives', evaluator: specificDice(5)},

  {x: 0, y: 5, defaultContent: 'Sixes', stateful: false, id: 'label-sixes', evaluator: null},
  {x: 1, y: 5, defaultContent: '', stateful: true, id: 'sixes', evaluator: specificDice(6)},

  {x: 0, y: 6, defaultContent: 'Top section score', stateful: false, id: 'label-topscore', evaluator: null},
  {
    x: 1,
    y: 6,
    defaultContent: '',
    stateful: true,
    id: 'topscore',
    evaluator: traditionalTopScore,
    evaluateAlways: true,
  },

  {x: 0, y: 7, defaultContent: 'Bonus', stateful: false, id: 'label-bonus', evaluator: null},
  {x: 1, y: 7, defaultContent: '', stateful: true, id: 'bonus', evaluator: topBonusTraditional, evaluateAlways: true},

  {x: 0, y: 8, defaultContent: 'Pair', stateful: false, id: 'label-pair', evaluator: null},
  {x: 1, y: 8, defaultContent: '', stateful: true, id: 'pair', evaluator: sameDice(2)},

  {x: 0, y: 9, defaultContent: 'Two Pair', stateful: false, id: 'label-two-pair', evaluator: null},
  {x: 1, y: 9, defaultContent: '', stateful: true, id: 'two-pair', evaluator: twoPair},

  {x: 0, y: 10, defaultContent: 'Three of a kind', stateful: false, id: 'label-three', evaluator: null},
  {x: 1, y: 10, defaultContent: '', stateful: true, id: 'three', evaluator: sameDice(3)},

  {x: 0, y: 11, defaultContent: 'Four of a kind', stateful: false, id: 'label-four', evaluator: null},
  {x: 1, y: 11, defaultContent: '', stateful: true, id: 'four', evaluator: sameDice(4)},

  {x: 0, y: 12, defaultContent: 'Straight (1-5)', stateful: false, id: 'label-low-straight', evaluator: null},
  {x: 1, y: 12, defaultContent: '', stateful: true, id: 'low-straight', evaluator: straight(1)},

  {x: 0, y: 13, defaultContent: 'Straight (2-6)', stateful: false, id: 'label-high-straight', evaluator: null},
  {x: 1, y: 13, defaultContent: '', stateful: true, id: 'high-straight', evaluator: straight(2)},

  {x: 0, y: 14, defaultContent: 'Full house', stateful: false, id: 'label-fullhouse', evaluator: null},
  {x: 1, y: 14, defaultContent: '', stateful: true, id: 'fullhouse', evaluator: fullHouse},

  {x: 0, y: 15, defaultContent: 'Anything random', stateful: false, id: 'label-any', evaluator: null},
  {x: 1, y: 15, defaultContent: '', stateful: true, id: 'any', evaluator: anyDice(5)},

  {x: 0, y: 16, defaultContent: 'Yachtzee', stateful: false, id: 'label-five', evaluator: null},
  {x: 1, y: 16, defaultContent: '', stateful: true, id: 'five', evaluator: sameDice(5, 50)},

  {x: 0, y: 17, defaultContent: 'Score', stateful: false, id: 'label-score', evaluator: null},
  {
    x: 1,
    y: 17,
    defaultContent: '',
    stateful: true,
    id: 'score',
    evaluator: traditionalTotalScore,
    evaluateAlways: true,
  },
] satisfies ExtendedCellType[]

function valueOf(boardState: Cell[], id: typeof cellGrid[number]['id']) {
  const cell = boardState.find((cell) => cell.id === id)
  return cell?.value ?? 0
}

const maxY = Math.max(...cellGrid.map((x) => x.y))

export class TraditionalRules extends Rules {
  getCellGrid(): CellType[] {
    return cellGrid
  }

  updateBoardState(gameState: GameState): void {
    const dice = gameState.currentTurn.throws[gameState.currentTurn.throws.length - 1]
    for (const player of gameState.players) {
      const p = gameState.players.indexOf(player)
      for (let y = 0; y <= maxY; ++y) {
        const ct = cellGrid[y * 2 + 1]
        const cell = gameState.boardStateByPlayer[p].find((c) => c.id === ct.id)
        if (!cell) throw new Error('Cell not found: ' + ct.id)
        if ((cell.value === null || ct.evaluateAlways) && ct.evaluator) {
          const upgrade = ct.evaluator(dice ?? [], gameState.boardStateByPlayer[p])
          Object.assign(cell, upgrade)
          if (p !== gameState.currentTurn.player) {
            cell.selectable = false
            cell.valueIfSelected = null
          }
        }
        if (cell.value !== null) cell.selectable = false
      }
    }
  }
}
