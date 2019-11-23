import React from 'react';
import { Rect, Group, Text } from 'react-konva';

type Props = {
    onClick: () => void,
    pass: boolean,
}
class PassButton extends React.Component<Props> {
    render() {
        return (
            <Group x={window.innerWidth-225} y={window.innerHeight-100} onClick={this.props.onClick}>
                <Rect
                    x={0}
                    y={0}
                    height={50}
                    width={200}
                    fill='lightgray'
                    stroke='black'
                    cornerRadius={5}
                />
                <Text x={0} y={0} width={200} height={50} 
                text={this.props.pass ? 'Pasar' : 'Tomar pieza'} fontSize={20} align='center' verticalAlign='middle' />
            </Group>)
    }
};

export default PassButton;