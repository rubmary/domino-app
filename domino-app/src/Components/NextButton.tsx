import React from 'react';
import { Rect, Group, Text } from 'react-konva';

type Props = {
    onClick: () => void,
}
class NextButton extends React.Component<Props> {
    render() {
        return (
            <Group x={window.innerWidth-450} y={window.innerHeight-100} onClick={this.props.onClick}>
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
                text='Siguiente Jugada' fontSize={20} align='center' verticalAlign='middle' />
            </Group>)
    }
};

export default NextButton;