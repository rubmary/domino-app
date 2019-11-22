import React from 'react';
import {Rect} from 'react-konva';
import Piece from './Piece';
import { KonvaEventObject } from 'konva/types/Node';

type Props = {
    player: number,
    pieces: Array<{id: number, points: Array<number>}>,
    drag: (id: number) => void,
    drop: ((e: KonvaEventObject<DragEvent>, x:number, y:number, player:number) => void) | (() => void),
}

class Hand extends React.Component<Props>{

    constructor(props:Props){
        super(props);
    }

    shouldComponentUpdate(nextProps:Props){
        return this.props.pieces.length !== nextProps.pieces.length;
    }
    render(){
        console.log(this.props);
        const {pieces} = this.props;
        const m = (pieces.length-1)/2;
        const cx = window.innerWidth/2;
        const cy = window.innerHeight/2;
        const player = this.props.player;
        const draw = pieces.map((piece:{id:number, points: Array<number>}, i:number) => {
            let x, y;
            if(player === 3){
                x = 10;
                y = cy + (i-m) * 55 - 25;
            }else{
                x = cx + (i - m) * 55 - 25;
                y = this.props.player === 1 ? 10 : window.innerHeight - 110;
            }
            return (
                <Piece 
                    x = {x}
                    y = {y}
                    player={this.props.player}
                    vertical={this.props.player !== 3}
                    drag={() => this.props.drag(piece.id)}
                    drop={this.props.drop}
                    key={"hand-"+piece.id.toString()}
                    points={piece.points}
                />
            );
        });
        return draw;
    }
}

export default Hand;