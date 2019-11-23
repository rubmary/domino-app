import React from 'react';
import { Rect, Group, Text } from 'react-konva';

type Props = {
    onClick: () => void,
    pass: boolean,
}
class PassButton extends React.Component<Props> {
    render() {
        return (
            <Group x={0} y={0} onClick={this.props.onClick}>
                <Rect
                    x={0}
                    y={0}
                    height={50}
                    width={100}
                    fill='lightgray'
                    stroke='black'
                />
                <Text x={0} y={0} width={100} height={50} 
                text={this.props.pass ? 'Pasar' : 'Tomar pieza'} fontSize={20} align='center' verticalAlign='middle' />
            </Group>)
    }
};

export default PassButton;