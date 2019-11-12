import React from 'react';
import { Rect } from 'react-konva';
import { KonvaEventObject } from 'konva/types/Node';
type Props = {
    x: number,
    y: number,
    points?: Array<number>,
    player: boolean,
    vertical: boolean,
    drag: () => void,
    drop: (e:KonvaEventObject<DragEvent>, x:number, y:number) => void,
}
class Piece extends React.Component<Props>{
    render(){
        return (<Rect
            x = {this.props.x}
            y = {this.props.y}
            draggable={this.props.player}
            fill='blue'
            width={this.props.vertical?50:100}
            height={this.props.vertical?100:50}
            onDragStart={this.props.drag}
            onDragEnd={(e:KonvaEventObject<DragEvent>) => this.props.drop(e, this.props.x, this.props.y)}
        />);    
    }
};

export default Piece;