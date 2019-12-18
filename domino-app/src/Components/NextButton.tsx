import React from 'react';
import { Button } from 'react-bootstrap';

type Props = {
    onClick: () => void,
}
class NextButton extends React.Component<Props> {
    render() {
        return (
            <Button
                onClick={() => {this.props.onClick()}}
                variant="primary"
                size="lg"
            > Sigiente Jugada
            </Button>
        );
    }
};

export default NextButton;