import React from 'react';
import {Rect} from 'react-konva';
import Piece from './Piece';
import { KonvaEventObject } from 'konva/types/Node';
type Props = {
    pieces: Array<{id: number}>,
    drag: (id: number) => void,
    drop: (e: KonvaEventObject<DragEvent>, x:number, y:number) => void,
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
        const draw = pieces.map((piece:{id:number}, i:number) => {
            return (
                <Piece 
                    x = {cx + (i - m) * 50 - 25}
                    y = {window.innerHeight - 100}
                    player
                    vertical
                    drag={() => this.props.drag(piece.id)}
                    drop={this.props.drop}
                    key={"hand-"+piece.id.toString()}
                />
            );
        });
        return draw;
    }
}

export default Hand;