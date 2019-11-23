export type Piece = { first: number, second: number }

export type Action = { placed: Piece, taken: Piece, side: string }
export type StateGame = {
    history: Array<Action>,
    pack: Array<Piece>,
    handPlayerOne: Array<Piece>,
    handPlayerTwo: Array<Piece>,
    player: number,
    maxPoint: number,
    initialHand: number
}

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
    '6V': [0, 2, 3, 5, 6, 8],
}

export const checkDouble = (points: Array<number>) => {
    return points.length === 2 && points[0] === points[1];
}

export const canPlay = (pieces: Array<{ id: number, points: Array<number> }>, left: number, right: number) => {
    const found = pieces.find((piece: { id: number, points: Array<number> }) =>
        piece.points[0] === left || piece.points[1] === left || piece.points[0] === right || piece.points[1] === right
    );
    return found !== undefined;
}

export const initialState = (
    game: StateGame,
    playerOne: Array<Piece>,
    playerTwo: Array<Piece>,
    pack: Array<Piece>
) => {
    game.maxPoint = 7;
    game.initialHand = 14;
    game.player = 1;
    const totalPieces = (game.maxPoint + 1) * (game.maxPoint + 2) / 2 - 2 * game.initialHand;
    game.history = new Array(0);
    game.handPlayerOne = new Array(game.maxPoint).fill(null).map((_, i: number) => {
        return { first: playerOne[i].first, second: playerOne[i].second }
    })
    game.handPlayerTwo = new Array(game.maxPoint).fill(null).map((_, i: number) => {
        return { first: playerTwo[i].first, second: playerTwo[i].second }
    })
    game.pack = new Array(game.maxPoint).fill(null).map((_, i: number) => {
        return { first: pack[i].first, second: pack[i].second }
    })
    const compare = (a: Piece, b: Piece) => {
        if (a.first !== b.first) {
            return a.first - b.first;
        }
        return a.second - b.second;
    };
    game.handPlayerOne.sort(compare);
    game.handPlayerTwo.sort(compare);
}

export const putAction = (game: StateGame, action: Action) => {
    if (action.side === "pass") {
        for (let i = 0; i < game.pack.length; i++) {
            if (game.pack[i].first === action.taken.first &&
                game.pack[i].second === action.taken.second) {
                game.pack.splice(i, 1);
            }
        }
    } else {
        const currentHand = game.player === 1 ? game.handPlayerOne : game.handPlayerTwo;
        for (let i = 0; i < currentHand.length; i++) {
            if (currentHand[i].first === action.placed.first &&
                currentHand[i].second === action.placed.second) {
                currentHand.splice(i, 1);
            }
        }
    }
    game.history.push(action);
    game.player = game.player === 1 ? 2 : 1;
    return true;
}