import React from 'react';
import {
    Button,
    Modal
} from 'react-bootstrap';

type Props = {
    message : string,
    show: boolean
    hideAlert : () => void,
    onClick: () => void
};

class NewGameAlert extends React.Component<Props> {

    shouldComponentUpdate(nextProps:Props){
        return this.props.show !== nextProps.show;
    }

    render() {
        return ( 
            <Modal show={this.props.show} onHide={() => {this.props.hideAlert()}}>
            <Modal.Header closeButton> 
                <Modal.Title>Advertencia</Modal.Title>
            </Modal.Header>
            <Modal.Body>{this.props.message}</Modal.Body>
            <Modal.Footer>
                <Button
                    variant="primary"
                    onClick={() => {this.props.onClick()}}
                > SÍ
                </Button>{' '}
                <Button
                    variant="secondary"
                    onClick={() => {this.props.hideAlert()}}
                > NO
                </Button>
            </Modal.Footer>
            </Modal>
        );
    }
}

export default NewGameAlert;
