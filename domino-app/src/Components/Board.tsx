import React from 'react';
import { Stage, Layer } from 'react-konva';
import { KonvaEventObject } from 'konva/types/Node';
import Piece from './Piece';
import Hand from './Hand';
import PassButton from './PassButton';
import NextButton from './NextButton';
import Alert from './Alert';
import {
    checkDouble,
    canPlay,
    getPointsSum,
    Action,
    GameState,
    initialGameState,
    putAction,
    logGameState,
    fetchStrategy
} from '../utils';

export type PieceValue = Array<{ id: number, points: Array<number> }>

type State = {
    pieces: Array<{ id: number, vertical: boolean }>,
    playerOne: PieceValue,
    playerTwo: PieceValue,
    deck: PieceValue,
    selected: number,
    center: number,
    turn: number,
    left: {
        x: number,
        y: number,
        value: number,
    }

    right: {
        x: number,
        y: number,
        value: number,
    }

    winner: number,
    took: boolean,
    showAlert: boolean,
    alertMessage: string,
    disableNext: boolean,
    disablePass: boolean
};

type Props = {
    player1: string,
    player2: string
}

class Board extends React.Component<Props, State>{

    positions: Array<{ x: number, y: number }> = [];
    orientation: Array<boolean> = [];
    set: Array<Array<number>> = [];
    gameState: GameState;

    constructor(props : Props) {
        super(props);
        const maxPoint = 3;
        const initialHand = 3;
        const totalPieces = (maxPoint+1)*(maxPoint+2)/2 - 2*initialHand;

        for (let i = 0; i <= maxPoint; i++) {
            for (let j = i; j <= maxPoint; j++) {
                this.set.push([i, j]);
            }
        }
        for (let i = 0; i < this.set.length; i++) {
            let j = Math.floor(Math.random() * (this.set.length - i));
            let t = this.set[i];
            this.set[i] = this.set[i + j];
            this.set[i + j] = t;
        }

        this.state = {
            pieces: [],
            playerOne: new Array(initialHand).fill(null).map((_, i: number) => {
                return { id: i, points: this.set[i] }
            }),
            playerTwo: new Array(initialHand).fill(null).map((_, i: number) => {
                return { id: i + initialHand, points: this.set[i + initialHand] }
            }),
            deck: new Array(totalPieces).fill(null).map((_, i: number) => {
                return { id: i + 2*initialHand, points: this.set[i + 2*initialHand] }
            }),
            selected: -1,
            center: -1,
            left: { x: -1, y: -1, value: -1 },
            right: { x: -1, y: -1, value: -1 },
            turn: 1,
            took: false,
            winner: 0,
            showAlert: false,
            alertMessage: '',
            disableNext: false,
            disablePass: false
        }
        this.gameState = initialGameState(this.state.playerOne, this.state.playerTwo, this.state.deck);
        logGameState(this.gameState);
    }

    cx = window.innerWidth / 2;
    cy = window.innerHeight / 2;

    componentDidUpdate(prevProps: {}, prevState: State) {
        if (prevState.turn !== this.state.turn && this.state.winner === 0) {
            if (this.state.deck.length === 0 &&
                !canPlay(this.state.playerOne, this.state.left.value, this.state.right.value) &&
                !canPlay(this.state.playerTwo, this.state.left.value, this.state.right.value)) {
                const p1 = getPointsSum(this.state.playerOne), p2 = getPointsSum(this.state.playerTwo);
                if (p1 < p2) this.setState({ winner: 1 });
                else if (p1 > p2) this.setState({ winner: 2 });
                else this.setState({ winner: 3 });
            }
        }
    }

    swapPiece(id: number, prev: number, dir: number) {
        if (prev !== -1) {
            if (dir === 1 && prev !== this.set[id][0]) {
                let tmp = this.set[id][0];
                this.set[id][0] = this.set[id][1];
                this.set[id][1] = tmp;
            } else if (dir === -1 && prev !== this.set[id][1]) {
                let tmp = this.set[id][0];
                this.set[id][0] = this.set[id][1];
                this.set[id][1] = tmp;
            }
        }
    }

    takeFromDeck(callback? : () => void) {
        const deck = [...this.state.deck];
        const playerOne = [...this.state.playerOne];
        const playerTwo = [...this.state.playerTwo];
        const hand = this.state.turn === 1 ? playerOne : playerTwo;
        const piece = deck.shift()!;

        hand.push(piece);
        this.gameState.takenPiece = {first: piece.points[0], second: piece.points[1]};
        return this.setState({ deck, playerOne, playerTwo, took: true }, callback);
    }

    hideAlert() {
        this.setState({
            showAlert: false
        });
    }

    alert(message : string) {
        this.setState({
            showAlert: true,
            alertMessage: message
        });
    }
    pass(callback? : () => void) {
        if (this.state.winner !== 0) {
            this.alert('Juego terminado');
            return;
        }
        if (this.state.pieces.length === 0) {
            this.alert('Existe al menos una jugada posible');
            return;
        }
        const playerOne = [...this.state.playerOne];
        const playerTwo = [...this.state.playerTwo];
        if (this.state.turn === 1 && canPlay(playerOne, this.state.left.value, this.state.right.value)) {
            this.alert('Existe al menos una jugada posible');
            return;
        }
        if (this.state.turn === 2 && canPlay(playerTwo, this.state.left.value, this.state.right.value)) {
            this.alert('Existe al menos una jugada posible');
            return;
        }
        if (!this.state.took && this.state.deck.length > 0) {
            return this.takeFromDeck(callback);
        } else {
            console.log('passing...');
            const takenPiece = this.gameState.takenPiece;
            const action : Action = {
                placed: {first: -1, second: -1},
                taken: {first: takenPiece.first, second: takenPiece.second},
                side: "pass"
            };
            const orientation = this.gameState.orientation;
            putAction(this.gameState, action, orientation);
            logGameState(this.gameState);
            this.setState({ turn: this.state.turn === 1 ? 2 : 1, took: this.state.deck.length === 0 });
        }
    }

    updatePositions(pcs: Array<{ id: number, vertical: boolean }>) {
        const pieces = JSON.parse(JSON.stringify(pcs));
        const { center } = this.state;

        let pos = -1;
        for (let i = 0; i < pieces.length; i++) {
            if (pieces[i].id === center) {
                pos = i;
                break;
            }
        }
        if (pos === -1) return;
        let dir = 1;

        let px = this.cx, py = this.cy;
        let prev = -1;

        this.orientation[pos] = checkDouble(this.set[pieces[pos].id]);
        for (let i = pos; i < pieces.length; i++) {
            const { id } = pieces[i];
            let double = checkDouble(this.set[id]);
            let far = (double ? (px + dir * 125) : (px + dir * 50));
            if (far <= 175 || far >= window.innerWidth - 100) {
                // Vertical 
                px -= dir * (double ? 50 : 75);
                py += 75;
                this.positions[i] = { x: px - 25, y: py - 50 };
                this.orientation[i] = true;
                this.swapPiece(id, prev, 1);
                prev = this.set[id][1];
                if (++i === pieces.length) break;
                if (!checkDouble(this.set[pieces[i].id])) {
                    py += 100;
                    this.orientation[i] = true;
                    this.positions[i] = { x: px - 25, y: py - 50 };
                    this.swapPiece(pieces[i].id, prev, 1);
                    prev = this.set[pieces[i].id][1];
                    if (++i === pieces.length) break;
                    py += 25;
                    px -= dir * 75;
                    this.swapPiece(pieces[i].id, prev, -dir);
                    this.positions[i] = { x: px - 50, y: py - 25 };
                    this.orientation[i] = false;
                    prev = this.set[pieces[i].id][(dir === 1 ? 0 : 1)];
                } else {
                    py += 75;
                    this.positions[i] = { x: px - 50, y: py - 25 };
                    prev = this.set[pieces[i].id][0];
                    this.orientation[i] = false;
                    if (++i === pieces.length) break;
                    py += 75;
                    this.orientation[i] = true;
                    this.positions[i] = { x: px - 25, y: py - 50 };
                    this.swapPiece(pieces[i].id, prev, 1);
                    prev = this.set[pieces[i].id][1];
                    if (++i === pieces.length) break;
                    py += 25;
                    px -= dir * 75;
                    this.swapPiece(pieces[i].id, prev, -dir);
                    this.positions[i] = { x: px - 50, y: py - 25 };
                    this.orientation[i] = false;
                    prev = this.set[pieces[i].id][(dir === 1 ? 0 : 1)];

                }
                dir *= -1;
                if (i + 1 < pieces.length && checkDouble(this.set[pieces[i + 1].id])) px += dir * 75;
                else px += dir * 100;
            } else {
                this.positions[i] = { x: px - (double ? 25 : 50), y: py - (double ? 50 : 25) };
                this.orientation[i] = double;
                const id = pieces[i].id;
                this.swapPiece(id, prev, dir);
                if (dir === -1) prev = this.set[id][0];
                else prev = this.set[id][1];

                if (double) px += dir * 75;
                else {
                    if (i + 1 < pieces.length && checkDouble(this.set[pieces[i + 1].id])) px += dir * 75;
                    else px += dir * 100;
                }
            }
        }
        const right = { x: px, y: py, value: prev };
        px = this.cx;
        py = this.cy;

        dir = -1;
        prev = -1;
        for (let i = pos; (pieces.length > 0) && i >= 0; i--) {
            const { id } = pieces[i];
            let double = checkDouble(this.set[id]);
            let far = (double ? (px + dir * 125) : (px + dir * 50));
            if (far <= 175 || far >= window.innerWidth - 100) {
                // Vertical 
                px -= dir * (double ? 50 : 75);
                py -= 75;
                this.positions[i] = { x: px - 25, y: py - 50 };
                this.orientation[i] = true;
                this.swapPiece(id, prev, -1);
                prev = this.set[id][0];
                if (--i === -1) break;
                if (!checkDouble(this.set[pieces[i].id])) {
                    py -= 100;
                    this.orientation[i] = true;
                    this.positions[i] = { x: px - 25, y: py - 50 };
                    this.swapPiece(pieces[i].id, prev, -1);
                    prev = this.set[pieces[i].id][0];
                    if (--i === -1) break;
                    py -= 25;
                    px -= dir * 75;
                    this.swapPiece(pieces[i].id, prev, -dir);
                    this.positions[i] = { x: px - 50, y: py - 25 };
                    this.orientation[i] = false;
                    prev = this.set[pieces[i].id][(dir === -1 ? 1 : 0)];
                } else {
                    py -= 75;
                    this.positions[i] = { x: px - 50, y: py - 25 };
                    prev = this.set[pieces[i].id][0];
                    this.orientation[i] = false;
                    if (--i === -1) break;
                    py -= 75;
                    this.orientation[i] = true;
                    this.positions[i] = { x: px - 25, y: py - 50 };
                    this.swapPiece(pieces[i].id, prev, -1);
                    prev = this.set[pieces[i].id][0];
                    if (--i === -1) break;
                    py -= 25;
                    px -= dir * 75;
                    this.swapPiece(pieces[i].id, prev, -dir);
                    this.positions[i] = { x: px - 50, y: py - 25 };
                    this.orientation[i] = false;
                    prev = this.set[pieces[i].id][(dir === -1 ? 1 : 0)];

                }
                dir *= -1;
                if (i - 1 >= 0 && checkDouble(this.set[pieces[i - 1].id])) px += dir * 75;
                else px += dir * 100;
            } else {
                this.positions[i] = { x: px - (double ? 25 : 50), y: py - (double ? 50 : 25) };
                this.orientation[i] = double;
                const id = pieces[i].id;
                this.swapPiece(id, prev, dir);
                if (dir === -1) prev = this.set[id][0];
                else prev = this.set[id][1];

                if (double) px += dir * 75;
                else {
                    if (i - 1 >= 0 && checkDouble(this.set[pieces[i - 1].id])) px += dir * 75;
                    else px += dir * 100;
                }
            }
        }
        const left = { x: px, y: py, value: prev };
        this.setState({ left, right, pieces });
    }

    dragStart = (id: number) => {
        this.setState({ selected: id });
    }

    dragEnd = (e: KonvaEventObject<DragEvent>, x: number, y: number) => {
        const { selected, pieces } = this.state;
        let { turn } = this.state;
        const playerOne = [...this.state.playerOne];
        const playerTwo = [...this.state.playerTwo];
        let dx, dy;
        let placed = false;
        const attrs = e.currentTarget.getAttrs();
        const nx = attrs.x + 25, ny = attrs.y + 50;

        if (pieces.length === 0) {
            dx = nx - this.cx;
            dy = ny - this.cy;
            this.setState({ center: selected })
            if (dx * dx + dy * dy <= 100000) {
                this.pushPiece(false, selected);
                placed = true;
            }
        } else {
            let dx1, dx2, dy1, dy2;

            dx1 = nx - this.state.left.x; dx2 = nx - this.state.right.x;
            dy1 = ny - this.state.left.y; dy2 = ny - this.state.right.y;
            if (dx1 * dx1 + dy1 * dy1 < dx2 * dx2 + dy2 * dy2 && dx1 * dx1 + dy1 * dy1 <= 10000) {
                const { value } = this.state.left;
                if (value === this.set[selected][0] || value === this.set[selected][1]) {
                    this.pushPiece(false, selected);
                    placed = true;
                }
            } else if (dy2 * dy2 + dx2 * dx2 <= 10000) {
                const { value } = this.state.right;
                if (value === this.set[selected][0] || value === this.set[selected][1]) {
                    this.pushPiece(true, selected);
                    placed = true;
                }
            }
        }
        if (!placed) {
            e.target.to({
                duration: 0.25,
                x,
                y,
            });
        } else {
            if (turn === 1) {
                for (let i = 0; i < playerOne.length; i++) {
                    if (playerOne[i].id === selected) {
                        playerOne.splice(i, 1);
                        break;
                    }
                }
                turn = 2;
            } else {
                for (let i = 0; i < playerTwo.length; i++) {
                    if (playerTwo[i].id === selected) {
                        playerTwo.splice(i, 1);
                        break;
                    }
                }
                turn = 1;
            }
            e.target.remove();
        }
        let winner = 0;
        if (playerOne.length === 0) {
            winner = 1;
        } else if (playerTwo.length === 0) {
            winner = 2;
        }
        this.setState({ selected: -1, playerOne, playerTwo, turn, winner });
    }

    selectPiece = (id: number) => {
        this.setState({ selected: id });
    }

    pushPiece(right: boolean, id: number) {
        let orientation = this.gameState.orientation;
        if (this.state.left.value === this.state.right.value) {
            orientation = !right;
        }
        const pieces = [...this.state.pieces];
        if (!right) {
            pieces.unshift({
                id,
                vertical: false,
            })
            this.positions.unshift({ x: -1, y: -1 });
            this.orientation.unshift(false);
        } else {
            pieces.push({
                id,
                vertical: false,
            })
            this.positions.push({ x: -1, y: -1 });
            this.orientation.unshift(false);
        }

        const takenPiece = this.gameState.takenPiece;
        const action : Action = {
            placed: {first: this.set[id][0], second: this.set[id][1]},
            taken: {first: takenPiece.first, second: takenPiece.second},
            side: right ? "right" : "left"
        };
        putAction(this.gameState, action, orientation);
        logGameState(this.gameState);
        this.updatePositions(pieces);
        this.setState({ took: this.state.deck.length === 0 })
    }

    doAction = (piece: Array<number>, side : string) => {
        let right = side === 'right';
        if (!this.gameState.orientation) {
            right = !right;
        }
        let {turn} = this.state;
        let playerOne = [...this.state.playerOne];
        let playerTwo = [...this.state.playerTwo];
        const hand = turn === 1 ? playerOne : playerTwo;

        let index = 0;
        for (let i = 0; i < hand.length; i++) {
            if (hand[i].points[0] === piece[0] && hand[i].points[1] === piece[1]) {
                index = i;
                break;
            }
        }
        if(this.gameState.history.length === 0){
            this.setState({ center: hand[index].id })
        }
        this.pushPiece(right, hand[index].id);
        hand.splice(index, 1);
        let winner = hand.length === 0 ? turn : 0;
        turn = turn === 1 ? 2 : 1;
        this.setState({turn, playerTwo, playerOne, winner});
    }

    nextMove() {
        if (this.state.winner !== 0) {
            this.alert('Juego terminado');
            return;
        }
        const {turn} = this.state;
        const playerType = turn === 1 ? this.props.player1 : this.props.player2;
        if (playerType === 'player') {
            this.alert('Debes realizar una jugada');
            return;
        }

        let playerOne = [...this.state.playerOne];
        let playerTwo = [...this.state.playerTwo];
        let hand = turn === 1 ? playerOne : playerTwo;
        const left = this.state.left.value;
        const right = this.state.right.value;
        if (left === -1 && right === -1) {
            fetchStrategy(this.gameState, this.doAction);
            return;
        }
        if(!canPlay(hand, left, right)) {
            const callback = () => {
                const f = () => {
                    logGameState(this.gameState);
                    playerOne = [...this.state.playerOne];
                    playerTwo = [...this.state.playerTwo];
                    hand = turn === 1 ? playerOne : playerTwo;
                    console.log("Desactivar disabled");
                    this.setState({disableNext: false});
                    if(!canPlay(hand, left, right)) {
                        this.pass();
                        return;
                    }
                    fetchStrategy(this.gameState, this.doAction);
                }
                setTimeout(f, 500);
            }
            this.setState({disableNext: true}, () => this.pass(callback));
            return;
        }
        fetchStrategy(this.gameState, this.doAction);
    }

    buttons() {
        const {player1, player2} = this.props;
        const currentPlayer = this.state.turn === 1 ? player1 : player2;
        const next =  <NextButton
            onClick={() => this.nextMove()}
            disabled={
                currentPlayer==='player' ||
                this.state.disableNext ||
                this.state.winner !== 0
            }
        />;
        const pass = <PassButton
            pass={this.state.took}
            onClick={() => this.pass()}
            disabled={
                currentPlayer==='pc' ||
                this.state.winner !== 0
            }
        />;
        let buttons = <>{next}{' '}{pass}</>;
        if (player1 === 'pc' && player2 === 'pc'){
            buttons = next;
        }
        return <div className='buttons'>{buttons}</div>;
    }
    render() {
        const { pieces, winner } = this.state;
        const draw = pieces.map((piece: { id: number, vertical: boolean }, i: number) => {
            return (
                <Piece
                    show={true}
                    key={piece.id}
                    x={this.positions[i].x}
                    y={this.positions[i].y}
                    move={false}
                    points={this.set[piece.id]}
                    vertical={this.orientation[i]}
                    player={0}
                    drag={() => { }}
                    drop={() => { }}
                />
            )
        });
        let message;
        let messagePoints = "";
        if (this.state.winner === 0) {
            message = 'Turno del jugador ' + this.state.turn;
        } else if (this.state.winner === 3) {
            message = 'Juego terminado'
            messagePoints = 'Empate';
        } else {
            message = 'Juego terminado'
            messagePoints = 'Gana ' + this.state.winner + ' con ' +
                getPointsSum(this.state.winner === 1 ? this.state.playerTwo : this.state.playerOne) + ' puntos'
        }
        const {player1, player2} = this.props;
        return (
            <>
                <Alert
                    message={this.state.alertMessage}
                    show={this.state.showAlert}
                    hideAlert={() => this.hideAlert()}
                />
                <h1 className='gameStatus'>
                    {message}
                    <br>{}</br>
                    {messagePoints}
                </h1>
                <Stage width={window.innerWidth} height={window.innerHeight - 70}>
                    <Layer>
                        {draw}
                        <Hand
                            show={player2==='pc' || winner !== 0}
                            player={1}
                            move={
                                this.state.winner === 0 &&
                                this.state.turn === 1 &&
                                this.props.player1==='player'
                            }
                            pieces={this.state.playerOne}
                            drag={this.dragStart}
                            drop={this.dragEnd}
                        />
                        <Hand
                            show={player1==='pc' || winner !== 0}
                            player={2}
                            move={
                                this.state.winner === 0 &&
                                this.state.turn === 2 &&
                                this.props.player2 === 'player'
                            }
                            pieces={this.state.playerTwo}
                            drag={this.dragStart}
                            drop={this.dragEnd}
                        />
                        <Hand
                            show={(player1==='pc' && player2==='pc') || winner !== 0}
                            player={3}
                            move={false}
                            pieces={this.state.deck}
                            drag={() => { }}
                            drop={() => { }}
                        />
                    </Layer>
                </Stage>
                {this.buttons()}
            </>
        )
    }
}

export default Board;