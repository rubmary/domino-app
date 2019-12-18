import React from 'react';
import Piece from './Piece';
import { KonvaEventObject } from 'konva/types/Node';

type Props = {
    show: boolean,
    player: number,
    pieces: Array<{id: number, points: Array<number>}>,
    drag: (id: number) => void,
    drop: ((e: KonvaEventObject<DragEvent>, x:number, y:number) => void) | (() => void),
    move: boolean,
}

class Hand extends React.Component<Props>{

    shouldComponentUpdate(nextProps:Props){
        return (
            (this.props.pieces.length !== nextProps.pieces.length) ||
            (this.props.move !== nextProps.move) ||
            (this.props.show !== nextProps.show)
        );
    }

    innerHeight = window.innerHeight-75;
    render(){
        const {pieces} = this.props;
        const m = (pieces.length-1)/2;
        const cx = window.innerWidth/2;
        const cy = this.innerHeight/2;
        const player = this.props.player;
        const draw = pieces.map((piece:{id:number, points: Array<number>}, i:number) => {
            let x, y;
            if(player === 3){
                x = 30;
                y = cy + (i-m) * 55 - 25;
            }else{
                x = cx + (i - m) * 55 - 25;
                y = this.props.player === 1 ? 30 : this.innerHeight - 110;
            }
            return (
                <Piece
                    show = {this.props.show}
                    x = {x}
                    y = {y}
                    player={this.props.player}
                    move={this.props.move}
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