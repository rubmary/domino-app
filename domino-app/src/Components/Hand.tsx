import React from 'react';
import Piece from './Piece';
import { KonvaEventObject } from 'konva/types/Node';
import { canvasWidth, canvasHeight } from '../utils';

type Props = {
  show: boolean;
  player: number;
  pieces: Array<{ id: number; points: Array<number> }>;
  drag: (id: number) => void;
  drop:
    | ((e: KonvaEventObject<DragEvent>, x: number, y: number) => void)
    | (() => void);
  move: boolean;
};

class Hand extends React.Component<Props> {
  shouldComponentUpdate(nextProps: Props) {
    return (
      this.props.pieces.length !== nextProps.pieces.length ||
      this.props.move !== nextProps.move ||
      this.props.show !== nextProps.show
    );
  }

  render() {
    const { pieces } = this.props;
    const m = (pieces.length - 1) / 2;
    const cx = canvasWidth() / 2;
    const cy = canvasHeight() / 2;
    const player = this.props.player;
    const draw = pieces.map(
      (piece: { id: number; points: Array<number> }, i: number) => {
        let x, y;
        if (player === 3) {
          x = 30;
          y = cy + (i - m) * 55 - 25;
        } else {
          x = cx + (i - m) * 55 - 25;
          y = this.props.player === 1 ? 30 : canvasHeight() - 110;
        }
        return (
          <Piece
            show={this.props.show}
            x={x}
            y={y}
            player={this.props.player}
            move={this.props.move}
            vertical={this.props.player !== 3}
            drag={() => this.props.drag(piece.id)}
            drop={this.props.drop}
            key={'hand-' + piece.id.toString()}
            points={piece.points}
          />
        );
      }
    );
    return draw;
  }
}

export default Hand;
