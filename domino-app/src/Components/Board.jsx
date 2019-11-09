import React from 'react';
import { Stage, Layer, Rect, Circle} from 'react-konva';
class Board extends React.Component {

	cx = window.innerWidth/2;
	cy = (window.innerHeight-100)/2;

	state = {
		pieces: [],
	}

	pushPiece(option){
		const {pieces} = this.state; 
		if(option === -1){
			pieces.unshift({
				id: pieces.length,
			})
		}else{
			pieces.push({
				id: pieces.length,
			})
		}
		this.setState({pieces});
	}

	render() {
		const draw = [];
		const {pieces} = this.state;

		let pos = 0;
		for(let i = 0; i < pieces.length; i++){
			if(pieces[i].id === pos){
				pos = i;
				break;
			}
		}

		for(let i = 0; i < pieces.length; i++){
			draw.push(
				<Rect
					x={this.cx-50 + 105*(i-pos)}
					y={this.cy-25}
					width={100}
					height={50}
					fill='blue'
				/>
			);
		}


		return (
			<>
				<Stage width={window.innerWidth} height={window.innerHeight-100}>
					<Layer>
						{draw}
						<Circle fill='black' radius={5} x={this.cx} y = {this.cy}/>
					</Layer>
				</Stage>
				<button onClick={()=>this.pushPiece(-1)}>Izquierda</button>
				<button onClick={()=>this.pushPiece(1)}>Derecha</button>
			</>
		)
	}
}

export default Board;