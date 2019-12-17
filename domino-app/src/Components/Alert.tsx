import React from 'react';
import {
    Button,
    Modal
} from 'react-bootstrap';

type Props = {
    message : string,
    show: boolean
    hideAlert : () => void
};

class Alert extends React.Component<Props> {

    shouldComponentUpdate(nextProps:Props){
        return this.props.show !== nextProps.show;
    }

    render() {
        return ( 
            <Modal show={this.props.show} onHide={() => {this.props.hideAlert()}}>
            <Modal.Header closeButton> 
                <Modal.Title>Alerta</Modal.Title>
            </Modal.Header>
            <Modal.Body>{this.props.message}</Modal.Body>
            <Modal.Footer>
                <Button
                    variant="primary"
                    onClick={() => {this.props.hideAlert()}}
                > OK
                </Button>
            </Modal.Footer>
            </Modal>
        );
    }
}

export default Alert;
