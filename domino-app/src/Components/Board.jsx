import React from 'react';
import { Stage, Layer, Rect, Circle } from 'react-konva';
class Board extends React.Component {

	cx = window.innerWidth / 2;
	cy = (window.innerHeight - 100) / 2;

	state = {
		pieces: [],
	}

	pushPiece(right, double) {
		const { pieces } = this.state;
		if (!right) {
			pieces.unshift({
				id: pieces.length,
				double,
			})
		} else {
			pieces.push({
				id: pieces.length,
				double,
			})
		}
		this.setState({ pieces });
	}

	render() {
		const draw = [];
		const { pieces } = this.state;

		let pos = 0;
		for (let i = 0; i < pieces.length; i++) {
			if (pieces[i].id === pos) {
				pos = i;
				break;
			}
		}

		let dir = 1;

		let px = this.cx, py = this.cy;
		for (let i = pos; i < pieces.length; i++) {
			const {double} = pieces[i];
			let far = (double ? (px + dir * 125) : (px + dir * 50));
			if (far <= 100 || far >= window.innerWidth - 100) {
				// Vertical 
				px -= dir * (double ? 50 : 75);
				py += 75;
				draw.push(
					<Rect
						x={px - 25}
						y={py - 50}
						width={50}
						height={100}
						fill='blue' />
				);
				if(++i === pieces.length) break;
				if(!pieces[i].double){
					py += 100;
					draw.push(
						<Rect
							x={px - 25}
							y={py - 50}
							width={50}
							height={100}
							fill='blue' />
					);
					if(i + 1 < pieces.length) pieces[i+1].double = false;
				}else{
					py += 75;
					draw.push(
						<Rect
							x={px - 50}
							y={py - 25}
							width={100}
							height={50}
							fill='blue' />
					);
					if(++i === pieces.length) break;
					py += 75;
					draw.push(
						<Rect
							x={px - 25}
							y={py - 50}
							width={50}
							height={100}
							fill='blue' />
					);
					if(i + 1 < pieces.length) pieces[i+1].double = false;
				}
				py += 25;
				px -= dir * 75;
				dir *= -1;
			} else {
				draw.push(
					<Rect
						x={px - (double ? 25 : 50)}
						y={py - (double ? 50 : 25)}
						width={double ? 50 : 100}
						height={double ? 100 : 50}
						fill='blue' />
				);
				if(double) px += dir*75;
				else{
					if(i + 1 < pieces.length && pieces[i+1].double) px += dir*75;
					else px += dir*100; 
				}
			}
		}

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
				draw.push(
					<Rect
						x={px - 25}
						y={py - 50}
						width={50}
						height={100}
						fill='blue' />
				);
				if(--i < 0) break;
				if(!pieces[i].double){
					py -= 100;
					draw.push(
						<Rect
							x={px - 25}
							y={py - 50}
							width={50}
							height={100}
							fill='blue' />
					);
					if(i - 1 >= 0) pieces[i-1].double = false;
				}else{
					py -= 75;
					draw.push(
						<Rect
							x={px - 50}
							y={py - 25}
							width={100}
							height={50}
							fill='blue' />
					);
					if(--i < 0) break;
					py -= 75;
					draw.push(
						<Rect
							x={px - 25}
							y={py - 50}
							width={50}
							height={100}
							fill='blue' />
					);
					if(i - 1 >= 0) pieces[i-1].double = false;
				}
				py -= 25;
				px -= dir * 75;
				dir *= -1;
			} else {
				draw.push(
					<Rect
						x={px - (double ? 25 : 50)}
						y={py - (double ? 50 : 25)}
						width={double ? 50 : 100}
						height={double ? 100 : 50}
						fill='blue' />
				);
				if(double) px += dir*75;
				else{
					if(i - 1 >= 0 && pieces[i-1].double) px += dir*75;
					else px += dir*100; 
				}
			}
		}



		return (
			<>
				<Stage width={window.innerWidth} height={window.innerHeight - 100}>
					<Layer>
						{draw}
						<Circle fill='black' radius={5} x={this.cx} y={this.cy} />
					</Layer>
				</Stage>
				<button onClick={() => this.pushPiece(false, false)}>Izquierda</button>
				<button onClick={() => this.pushPiece(false, true)}>Izquierda doble</button>
				<button onClick={() => this.pushPiece(true, false)}>Derecha</button>
				<button onClick={() => this.pushPiece(true, true)}>Derecha doble</button>
			</>
		)
	}
}

export default Board;