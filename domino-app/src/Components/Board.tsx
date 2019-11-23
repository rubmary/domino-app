import React from 'react';
import { Stage, Layer, Rect, Circle } from 'react-konva';
import Konva from 'konva';
import { KonvaEventObject } from 'konva/types/Node';
import { number } from 'prop-types';
import Piece from './Piece';
import Hand from './Hand';

import { checkDouble, canPlay } from '../utils';
import PassButton from './PassButton';

type PieceValue = Array<{ id: number, points: Array<number> }>

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
}

class Board extends React.Component<{}, State>{

	positions: Array<{ x: number, y: number }> = [];
	orientation: Array<boolean> = [];
	set: Array<Array<number>> = [];
	constructor() {
		super({});
		for (let i = 0; i <= 6; i++) {
			for (let j = i; j <= 6; j++) {
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
			playerOne: new Array(7).fill(null).map((_, i: number) => { return { id: i, points: this.set[i] } }),
			playerTwo: new Array(7).fill(null).map((_, i: number) => { return { id: i + 7, points: this.set[i + 7] } }),
			deck: new Array(14).fill(null).map((_, i: number) => { return { id: i + 14, points: this.set[i + 14] } }),
			selected: -1,
			center: -1,
			left: { x: -1, y: -1, value: -1 },
			right: { x: -1, y: -1, value: -1 },
			turn: 1,
			took: false,
			winner: 0,
		}

	}

	cx = window.innerWidth / 2;
	cy = window.innerHeight / 2;

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

	takeFromDeck() {
		const deck = [...this.state.deck];
		const playerOne = [...this.state.playerOne];
		const playerTwo = [...this.state.playerTwo];
		const piece = deck.shift();
		if (piece) {
			if (this.state.turn === 1) playerOne.push(piece);
			else playerTwo.push(piece);
		}
		this.setState({ deck, playerOne, playerTwo, took: true });
	}

	pass() {
		if (this.state.pieces.length === 0) return;
		const playerOne = [...this.state.playerOne];
		const playerTwo = [...this.state.playerTwo];
		if (this.state.turn === 1 && canPlay(playerOne, this.state.left.value, this.state.right.value)) {
			alert('Existe una jugada posible');
			return;
		}
		if (this.state.turn === 2 && canPlay(playerTwo, this.state.left.value, this.state.right.value)) {
			alert('Existe una jugada posible');
			return;
		}
		if (!this.state.took && this.state.deck.length > 0) {
			this.takeFromDeck();
		} else {
			this.setState({ turn: this.state.turn === 1 ? 2 : 1, took: this.state.deck.length === 0 });
		}
	}

	updatePositions(pcs: Array<{ id: number, vertical: boolean }>) {
		const pieces = JSON.parse(JSON.stringify(pcs));
		const { center } = this.state;

		let pos = -1;
		console.log(center, pieces);
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
			const { id, vertical } = pieces[i];
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
					console.log("HEY");
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
					console.log("HEY");
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
			const { id, vertical } = pieces[i];
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
				console.log('P', prev);
				if (--i === -1) break;
				if (!checkDouble(this.set[pieces[i].id])) {
					py -= 100;
					this.orientation[i] = true;
					this.positions[i] = { x: px - 25, y: py - 50 };
					this.swapPiece(pieces[i].id, prev, -1);
					console.log("HEY");
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
					console.log("HEY");
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

		console.log('THIS IS THE NEW LEFT', left);
		this.setState({ left, right, pieces });
	}

	isMoving = (e: KonvaEventObject<DragEvent>) => {
		const { x, y } = e.target.getAttrs();
		console.log(x, y);
	}

	dragStart = (id: number) => {
		console.log(id);
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

		console.log('WHAT', nx, ny);
		if (pieces.length === 0) {
			dx = nx - this.cx;
			dy = ny - this.cy;
			this.setState({ center: selected })
			if (dx * dx + dy * dy <= 100000) {
				this.pushPiece(true, selected);
				placed = true;
			}
		} else {
			let dx1, dx2, dy1, dy2;
			console.log('WE', nx, ny);

			console.log(this.state.left, this.state.right);
			dx1 = nx - this.state.left.x; dx2 = nx - this.state.right.x;
			dy1 = ny - this.state.left.y; dy2 = ny - this.state.right.y;
			console.log(dx1 * dx1 + dy1 * dy1, dx2 * dx2 + dy2 * dy2);
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
			this.setState({ took: this.state.deck.length === 0 })
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
		console.log(id);
		this.setState({ selected: id });
	}

	pushPiece(right: boolean, id: number) {
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
		this.updatePositions(pieces);
	}

	render() {
		const { pieces } = this.state;
		const draw = pieces.map((piece: { id: number, vertical: boolean }, i: number) => {
			return (
				<Piece
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
		return (
			<>
				<h1 className='gameStatus'>
					{this.state.winner === 0
						? ('Turno del jugador ' + this.state.turn)
						: ('Juego terminado. Gana ' + this.state.winner)
					}
				</h1>
				<Stage width={window.innerWidth} height={window.innerHeight}>
					<Layer>
						{draw}
						<Hand player={1} move={this.state.winner === 0 && this.state.turn === 1} pieces={this.state.playerOne} drag={this.dragStart} drop={this.dragEnd} />
						<Hand player={2} move={this.state.winner === 0 && this.state.turn === 2} pieces={this.state.playerTwo} drag={this.dragStart} drop={this.dragEnd} />
						<Hand player={3} move={false} pieces={this.state.deck} drag={() => { }} drop={() => { }} />
						<PassButton pass={this.state.took} onClick={() => this.pass()} />
					</Layer>
				</Stage>
			</>
		)
	}
}

export default Board;