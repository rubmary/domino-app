import React from 'react';
import { Stage, Layer, Rect, Circle } from 'react-konva';
import Konva from 'konva';
import { KonvaEventObject } from 'konva/types/Node';
import { number } from 'prop-types';
import Piece from './Piece';
import Hand from './Hand';

import {checkDouble} from '../utils';
type State = {
	pieces: Array<{id: number, double: boolean}>,
	playerOne: Array<{id: number, points: Array<number>}>,
	selected: number,
	center: number,
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
}

class Board extends React.Component<{},State>{

	positions:Array<{x:number,y:number}> = [];
	set:Array<Array<number> > = [];
	constructor(){
		super({});
		for(let i = 0; i <= 6; i++){
			for(let j = i; j <= 6; j++){
				this.set.push([i, j]);
			}
		}

		for(let i = 0; i < this.set.length; i++){
			let j = Math.floor(Math.random()*(this.set.length - i));
			let t = this.set[i];
			this.set[i] = this.set[i + j];
			this.set[i + j] = t;
		}

		this.state = {
			pieces: [],
			playerOne: new Array(7).fill(null).map((_, i:number) => { return {id: i, points: this.set[i]}}),
			selected: -1,
			center: -1,
			left: {x: -1, y: -1, value: -1},
			right: {x: -1, y: -1, value: -1},
		}

	}

	cx = window.innerWidth / 2;
	cy = (window.innerHeight - 100) / 2;

	updatePositions(pieces:Array<{id:number, double:boolean}>){
		const { center} = this.state;

		let pos = -1;
		console.log(center, pieces);
		for (let i = 0; i < pieces.length; i++) {
			if (pieces[i].id === center) {
				pos = i;
				break;
			}
		}
		if(pos === -1) return;
		let dir = 1;

		let px = this.cx, py = this.cy;
		for (let i = pos; i < pieces.length; i++) {
			const {double} = pieces[i];
			let far = (double ? (px + dir * 125) : (px + dir * 50));
			if (far <= 100 || far >= window.innerWidth - 100) {
				// Vertical 
				px -= dir * (double ? 50 : 75);
				py += 75;
				this.positions[i] = {x: px-25, y: py-50};
				if(++i === pieces.length) break;
				if(!pieces[i].double){
					py += 100;
					this.positions[i] = {x: px-25, y: py-50};
					if(i + 1 < pieces.length) pieces[i+1].double = false;
				}else{
					py += 75;
					this.positions[i] = {x: px-50, y: py-25};
					if(++i === pieces.length) break;
					py += 75;
					this.positions[i] = {x: px-25, y: py-50};
					if(i + 1 < pieces.length) pieces[i+1].double = false;
				}
				py += 25;
				px -= dir * 75;
				dir *= -1;
			} else {
				this.positions[i] = {x: px - (double ? 25 : 50), y: py - (double ? 50 : 25)};
				if(double) px += dir*75;
				else{
					if(i + 1 < pieces.length && pieces[i+1].double) px += dir*75;
					else px += dir*100; 
				}
			}
		}
		const right = {x: px, y: py, value: -1};
		px = this.cx; 
		py = this.cy;

		dir = -1;
		for (let i = pos; (pieces.length > 0) && i >= 0; i--) {
			const {double} = pieces[i];
			let far = (double ? (px + dir * 125) : (px + dir * 50));
			if (far <= 100 || far >= window.innerWidth - 100) {
				// Vertical 
				px -= dir * (double ? 50 : 75);
				py -= 75;
				this.positions[i] = {x: px-25, y: py-50};
				if(--i < 0) break;
				if(!pieces[i].double){
					py -= 100;
					this.positions[i] = {x: px-25, y: py-50};
					if(i - 1 >= 0) pieces[i-1].double = false;
				}else{
					py -= 75;
					this.positions[i] = {x: px-50, y: py-25};
					if(--i < 0) break;
					py -= 75;
					this.positions[i] = {x: px-25, y: py-50};
					if(i - 1 >= 0) pieces[i-1].double = false;
				}
				py -= 25;
				px -= dir * 75;
				dir *= -1;
			} else {
				this.positions[i] = {x: px-(double? 25 : 50), y: py-(double ? 50 : 25)};
				if(double) px += dir*75;
				else{
					if(i - 1 >= 0 && pieces[i-1].double) px += dir*75;
					else px += dir*100; 
				}
			}
		}
		const left = {x: px, y: py, value: -1};

		this.setState({left, right, pieces});
	}
	isMoving = (e:KonvaEventObject<DragEvent>) => {
		const {x,y} = e.target.getAttrs();
		console.log(x, y);
	}

	dragStart = (id: number) => {
		console.log(id);
		this.setState({selected: id});
	}

	dragEnd = (e:KonvaEventObject<DragEvent>, x: number, y: number) => {
		const { selected, pieces} = this.state;
		const playerOne = [...this.state.playerOne];
		let dx, dy;
		let placed = false;
		const attrs = e.currentTarget.getAttrs();
		const nx = attrs.x, ny =attrs.y;

		const double = checkDouble(this.set[selected])
		console.log('WHAT', nx, ny);
		if(pieces.length === 0){
			dx = nx - this.cx;
			dy = ny - this.cy;
			this.setState({center: selected})
			if(dx*dx + dy*dy <= 10000){
				this.pushPiece(true, double, selected);
				placed = true;
			}
		}else{
			let dx1, dx2, dy1, dy2;
			console.log('WE', nx, ny);

			console.log(this.state.left, this.state.right);
			dx1 = nx - this.state.left.x; dx2 = nx - this.state.right.x;
			dy1 = ny - this.state.left.y; dy2 = ny - this.state.right.y;
			console.log(dx1*dx1 + dy1*dy1, dx2*dx2 + dy2*dy2);
			if(dx1*dx1 + dy1*dy1 < dx2*dx2 + dy2*dy2 && dx1*dx1 + dy1*dy1 <= 10000){
				this.pushPiece(false, double, selected);
				placed = true;
			}else if(dy2*dy2 + dx2*dx2 <= 10000){
				this.pushPiece(true, double, selected);
				placed = true;
			}
		}
		if(!placed){
			e.target.to({
				duration: 0.25,
				x,
				y,
			});
		}else{
			for(let i = 0; i < playerOne.length; i++){
				if(playerOne[i].id === selected){
					playerOne.splice(i,1);
					break;
				}
			}
			e.target.remove();
		}
		this.setState({selected: -1, playerOne});
	}

	selectPiece = (id:number) => {
		console.log(id);
		this.setState({selected: id});
	}

	pushPiece(right:boolean, double: boolean, id: number) {
		const pieces = [...this.state.pieces];
		if (!right) {
			pieces.unshift({
				id,
				double,
			})
			this.positions.unshift({x:-1, y:-1});
		} else {
			pieces.push({
				id,
				double,
			})
			this.positions.push({x:-1, y:-1});
		}
		this.updatePositions(pieces);
	}

	render() {
		const { pieces } = this.state;
		const draw = pieces.map((piece: {id:number, double:boolean}, i:number) => {
			return (
				<Piece
					x = {this.positions[i].x}
					y = {this.positions[i].y}
					points = {this.set[piece.id]}
					vertical = {this.set[piece.id][0] === this.set[piece.id][1]}
					player={false}
					drag={()=>{}}
					drop={()=>{}}
				/>
			)
		});
		return (
			<>
				<Stage width={window.innerWidth} height={window.innerHeight}>
					<Layer>
						{draw}
						<Hand pieces={this.state.playerOne} drag={this.dragStart} drop={this.dragEnd}/>
					</Layer>
				</Stage>
			</>
		)
	}
}

export default Board;