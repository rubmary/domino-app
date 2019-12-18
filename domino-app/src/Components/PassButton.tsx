import React from 'react';
import { Button } from 'react-bootstrap';

type Props = {
    onClick: () => void,
    pass: boolean,
}
class PassButton extends React.Component<Props> {
    render() {
        return (
            <Button
                onClick={() => {this.props.onClick()}}
                variant="primary"
                size="lg"
            > {this.props.pass ? 'Pasar' : 'Tomar pieza'}
            </Button>
        );
    }
};

export default PassButton;