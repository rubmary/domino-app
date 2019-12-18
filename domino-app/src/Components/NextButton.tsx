import React from 'react';
import { Button } from 'react-bootstrap';

type Props = {
    onClick: () => void,
    disabled: boolean
};

class NextButton extends React.Component<Props> {
    render() {
        return (
            <Button
                onClick={() => {this.props.onClick()}}
                variant='primary'
                size='lg'
                disabled={this.props.disabled}
            > Sigiente Jugada
            </Button>
        );
    }
};

export default NextButton;