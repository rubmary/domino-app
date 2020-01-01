import React from 'react';
import { Rect, Circle, Group, Line } from 'react-konva';
import { KonvaEventObject } from 'konva/types/Node';
import { faces, pieceW, pieceH, circleR, border, line } from '../utils';

type Props = {
  show: boolean;
  x: number;
  y: number;
  points?: Array<number>;
  player: number;
  move: boolean;
  vertical: boolean;
  drag: () => void;
  drop:
    | ((e: KonvaEventObject<DragEvent>, x: number, y: number) => void)
    | (() => void);
};

type FaceProps = {
  points: number;
  ver: boolean;
  cx: number;
  cy: number;
};
const Face = (props: FaceProps) => {
  const { points, ver, cx, cy } = props;
  const id = points.toString() + (ver ? 'V' : 'H');
  const pos = faces[id];
  const dots = [];

  for (let i = 0; i < pos.length; i++) {
    dots.push(
      <Circle
        key={i}
        fill='black'
        radius={circleR()}
        x={cx + (pieceH() / 3) * (i + 1) - pieceH() / 6}
        y={cy + (pieceH() / 3) * (i + 1) - pieceH() / 6}
      />
    );
  }
  return <>{dots}</>;
};

class Piece extends React.Component<Props> {
  pieceX() {
    return this.props.vertical ? pieceH() : pieceW();
  }

  pieceY() {
    return this.props.vertical ? pieceW() : pieceH();
  }

  render() {
    const piece = !this.props.show ? (
      <Rect
        x={0}
        y={0}
        fill='#ffffe3'
        width={this.pieceX()}
        height={this.pieceY()}
        stroke='black'
        strokeWidth={1.5}
        cornerRadius={4}
      ></Rect>
    ) : (
      <Group>
        <Rect
          x={0}
          y={0}
          fill='#ffffe3'
          width={this.pieceX()}
          height={this.pieceY()}
          stroke='black'
          strokeWidth={1.5}
          cornerRadius={4}
        ></Rect>
        <Face
          points={this.props.points ? this.props.points[0] : 3}
          ver={this.props.vertical}
          cx={0}
          cy={0}
        />
        <Face
          points={this.props.points ? this.props.points[1] : 3}
          ver={this.props.vertical}
          cx={this.props.vertical ? 0 : pieceW() / 2}
          cy={this.props.vertical ? pieceW() / 2 : 0}
        />
        <Line
          points={
            this.props.vertical
              ? [border(), pieceH(), line(), pieceH()]
              : [pieceH(), border(), pieceH(), line()]
          }
          stroke='black'
          tension={2}
        />
        <Circle
          fill='#C97E28'
          radius={circleR()}
          x={this.pieceX() / 2}
          y={this.pieceY() / 2}
        />
      </Group>
    );

    return (
      <Group
        x={this.props.x}
        y={this.props.y}
        draggable={this.props.move}
        onDragStart={this.props.drag}
        onDragEnd={(e: KonvaEventObject<DragEvent>) =>
          this.props.drop(e, this.props.x, this.props.y)
        }
      >
        {piece}
      </Group>
    );
  }
}

export default Piece;
