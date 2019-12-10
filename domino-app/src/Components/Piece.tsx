import React from 'react';
import { Rect, Circle, Group, Line } from 'react-konva';
import { KonvaEventObject } from 'konva/types/Node';
import {faces} from '../utils';
type Props = {
    x: number,
    y: number,
    points?: Array<number>,
    player: number,
    move: boolean,
    vertical: boolean,
    drag: () => void,
    drop: ((e:KonvaEventObject<DragEvent>, x:number, y:number) => void) | (() => void),
}

type FaceProps = {
    points: number,
    ver: boolean,
    cx: number, 
    cy: number,
}
const Face = (props: FaceProps) => {
    const {points, ver, cx, cy} = props;
    const id = points.toString() + (ver ? 'V' : 'H');
    const pos = faces[id];
    const dots = [];
    for(let i = 0; i < pos.length; i++){
        const dy = Math.floor(pos[i]/3) - 1,
              dx = pos[i]%3 - 1;
        dots.push(<Circle fill='black' radius={5} x={cx+dx*15} y={cy+dy*15} />);
    }
    return <>{dots}</>;
}
class Piece extends React.Component<Props>{
    render(){
        const cx = this.props.vertical ? 25 : 50;
        const cy = this.props.vertical ? 50 : 25;
        return (
        <Group 
            x={this.props.x}
            y={this.props.y}
            draggable={this.props.move}
            onDragStart={this.props.drag} 
            onDragEnd={(e:KonvaEventObject<DragEvent>) => this.props.drop(e, this.props.x, this.props.y)}>
            <Rect
                x = {0}
                y = {0}
                fill='#ffffe3'
                width={this.props.vertical?50:100}
                height={this.props.vertical?100:50}
                stroke='black'
                strokeWidth={1.5}
                cornerRadius={4}
            >
            </Rect>
            <Face 
                points={this.props.points ? this.props.points[0] : 3}
                ver={this.props.vertical} 
                cx={cx - (this.props.vertical ? 0 : 25)}
                cy={cy - (this.props.vertical ? 25 : 0)}
            />
            <Face 
                points={this.props.points ? this.props.points[1] : 3} 
                ver={this.props.vertical} 
                cx={cx + (this.props.vertical ? 0 : 25)}
                cy={cy + (this.props.vertical ? 25 : 0)}
            />
            <Line
                points={this.props.vertical ? [5, 50, 45, 50] : [50, 5, 50, 45]}
                stroke='black'
                tension={2}
            />
            <Circle
                fill='#C97E28'
                radius={4}
                x={this.props.vertical ? 25 : 50}
                y={this.props.vertical ? 50 : 25}
            />
        </Group>);    
    }
};

export default Piece;