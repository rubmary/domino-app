import { PieceValue } from './Components/Board';

export const faces: { [i: string]: Array<number> } = {
  '0H': [],
  '0V': [],
  '1H': [4],
  '1V': [4],
  '2H': [0, 8],
  '2V': [2, 6],
  '3H': [0, 4, 8],
  '3V': [2, 4, 6],
  '4H': [0, 2, 6, 8],
  '4V': [0, 2, 6, 8],
  '5H': [0, 2, 4, 6, 8],
  '5V': [0, 2, 4, 6, 8],
  '6H': [0, 1, 2, 6, 7, 8],
  '6V': [0, 2, 3, 5, 6, 8]
};

export const checkDouble = (points: Array<number>) => {
  return points.length === 2 && points[0] === points[1];
};

export const canPlay = (
  pieces: Array<{ id: number; points: Array<number> }>,
  left: number,
  right: number
) => {
  const found = pieces.find(
    (piece: { id: number; points: Array<number> }) =>
      piece.points[0] === left ||
      piece.points[1] === left ||
      piece.points[0] === right ||
      piece.points[1] === right
  );
  return found !== undefined;
};

export const getPointsSum = (
  pieces: Array<{ id: number; points: Array<number> }>
) => {
  return pieces.reduce(
    (previousValue: number, current: { id: number; points: Array<number> }) => {
      return previousValue + current.points[0] + current.points[1];
    },
    0
  );
};

/********************** GAME STATE ********************/
const compare = (a: DominoPiece, b: DominoPiece) => {
  if (a.first !== b.first) {
    return a.first - b.first;
  }
  return a.second - b.second;
};

export type DominoPiece = { first: number; second: number };

export type Action = { placed: DominoPiece; taken: DominoPiece; side: string };

export type GameState = {
  history: Array<Action>;
  pack: Array<DominoPiece>;
  handPlayerOne: Array<DominoPiece>;
  handPlayerTwo: Array<DominoPiece>;
  takenPiece: DominoPiece;
  player: number;
  maxPoint: number;
  initialHand: number;
  orientation: boolean;
  left: number;
  right: number;
};

export const initialGameState = (
  playerOne: PieceValue,
  playerTwo: PieceValue,
  pack: PieceValue
) => {
  const maxPoint = 3;
  const initialHand = 3;
  const totalPieces = ((maxPoint + 1) * (maxPoint + 2)) / 2 - 2 * initialHand;
  console.log('totalPieces', totalPieces);
  console.log('initialHand', initialHand);
  let handPlayerOne = new Array(initialHand).fill(null).map((_, i: number) => {
    return { first: playerOne[i].points[0], second: playerOne[i].points[1] };
  });
  let handPlayerTwo = new Array(initialHand).fill(null).map((_, i: number) => {
    return { first: playerTwo[i].points[0], second: playerTwo[i].points[1] };
  });
  let packGame = new Array(totalPieces).fill(null).map((_, i: number) => {
    return { first: pack[i].points[0], second: pack[i].points[1] };
  });

  handPlayerOne.sort(compare);
  handPlayerTwo.sort(compare);
  let game: GameState = {
    history: new Array(0),
    pack: packGame,
    handPlayerOne: handPlayerOne,
    handPlayerTwo: handPlayerTwo,
    player: 1,
    maxPoint: maxPoint,
    initialHand: initialHand,
    orientation: true,
    left: -1,
    right: -1,
    takenPiece: { first: -1, second: -1 }
  };

  return game;
};

export const putAction = (
  game: GameState,
  action: Action,
  orientation: boolean
) => {
  game.orientation = orientation;

  if (!game.orientation) {
    if (action.side === 'left') {
      action.side = 'right';
    } else if (action.side === 'right') {
      action.side = 'left';
    }
  }

  const hand = game.player === 1 ? game.handPlayerOne : game.handPlayerTwo;

  if (action.taken.first !== -1) {
    hand.push(action.taken);
    hand.sort(compare);
    for (let i = 0; i < game.pack.length; i++) {
      if (
        game.pack[i].first === action.taken.first &&
        game.pack[i].second === action.taken.second
      ) {
        game.pack.splice(i, 1);
        break;
      }
    }
  }

  if (action.side !== 'pass') {
    for (let i = 0; i < hand.length; i++) {
      if (
        hand[i].first === action.placed.first &&
        hand[i].second === action.placed.second
      ) {
        hand.splice(i, 1);
      }
    }
    if (game.history.length === 0) {
      game.left = action.placed.first;
      game.right = action.placed.second;
    } else {
      const previousSide = action.side === 'left' ? game.left : game.right;
      const newSide =
        previousSide === action.placed.first
          ? action.placed.second
          : action.placed.first;
      if (action.side === 'left') {
        game.left = newSide;
      } else {
        game.right = newSide;
      }
    }
  }
  game.history.push(action);
  game.player = game.player === 1 ? 2 : 1;
  game.takenPiece = { first: -1, second: -1 };
  return true;
};

const stringPiece = (piece: DominoPiece) => {
  const first = piece.first === -1 ? '*' : piece.first;
  const second = piece.second === -1 ? '*' : piece.second;
  return '<' + first + ',' + second + '>';
};

export const logGameState = (game: GameState) => {
  console.log('Player: ' + game.player);
  console.log('Orientation: ' + game.orientation);
  console.log('History: ');
  for (let i = 0; i < game.history.length; i++) {
    let action = game.history[i];
    console.log(
      '\tTaken: ' +
        stringPiece(action.taken) +
        '\tPlaced: ' +
        stringPiece(action.placed) +
        '\tSide: ' +
        action.side
    );
  }
  let playerOneHand = '';
  for (let i = 0; i < game.handPlayerOne.length; i++) {
    playerOneHand = playerOneHand + ' ' + stringPiece(game.handPlayerOne[i]);
  }
  console.log('PlayerOne: ' + playerOneHand);

  let playerTwoHand = '';
  for (let i = 0; i < game.handPlayerTwo.length; i++) {
    playerTwoHand = playerTwoHand + ' ' + stringPiece(game.handPlayerTwo[i]);
  }
  console.log('PlayerTwo: ' + playerTwoHand);

  let pack = '';
  for (let i = 0; i < game.pack.length; i++) {
    pack = pack + ' ' + stringPiece(game.pack[i]);
  }
  console.log('Pack:      ' + pack);
  console.log('(left, right) = (' + game.left + ',' + game.right + ')');
  console.log('TakenPiece = ' + stringPiece(game.takenPiece));
  console.log(
    '-------------------------------------------------------------------'
  );
};

/********************************* STRATEGY *********************************/
export const fetchStrategy = (
  game: GameState,
  doAction: (piece: Array<number>, side: string) => void
) => {
  const N = game.history.length;
  const history = new Array(N).fill(null).map((_, i) => {
    let action = game.history[i];
    return {
      side: action.side,
      taken: [action.taken.first, action.taken.second],
      placed: [action.placed.first, action.placed.second]
    };
  });
  const currentHand =
    game.player === 1 ? game.handPlayerOne : game.handPlayerTwo;
  const hand = currentHand.map((piece, _) => {
    return [piece.first, piece.second];
  });

  const taken_piece = [game.takenPiece.first, game.takenPiece.second];
  const data = JSON.stringify({
    history: history,
    hand: hand,
    left: game.left,
    right: game.right,
    takenPiece: taken_piece
  });
  const QUERY: string = '/api/get_action';
  fetch(QUERY, {
    method: 'POST',
    body: data,
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => response.json())
    .then(data => doAction(data['piece'], data['side']));
};

/***************************** STATISTICS *****************************/

export type Statistic = {
  average: number;
  sum: number;
  games: number;
};

export const fetchGetStatistics = (
  callback: (p1: Statistic, p2: Statistic) => void
) => {
  const QUERY = '/api/get_statistics';
  fetch(QUERY)
    .then(response => response.json())
    .then(data => callback(data['player1'], data['player2']));
};

export const fetchAddResult = (
  player1: boolean,
  player2: boolean,
  utility: number
) => {
  const QUERY = '/api/add_result';
  const data = JSON.stringify({
    player1: player1,
    player2: player2,
    utility: utility
  });
  fetch(QUERY, {
    method: 'POST',
    body: data,
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(response => response.json());
};

/***************************** SIZE *****************************/

declare var document: any;

export const canvasWidth = function() {
  return Math.min(document.getElementById('root').clientWidth, 720);
};

export const canvasHeight = function() {
  return canvasWidth() * 0.6;
};

export const pieceW = function() {
  return canvasWidth() / 10;
};

export const pieceH = function() {
  return pieceW() / 2;
};

export const circleR = function() {
  return pieceH() * 0.1;
};

export const border = function() {
  return pieceH() * 0.05;
};

export const line = function() {
  return pieceH() - border() * 2;
};
