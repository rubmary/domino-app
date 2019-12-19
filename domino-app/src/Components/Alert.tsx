import React from 'react';
import {
    Button,
    Modal
} from 'react-bootstrap';

type Props = {
    message : string,
    show: boolean
    hideAlert : () => void,
    title? : string
};

class Alert extends React.Component<Props> {

    shouldComponentUpdate(nextProps:Props){
        return this.props.show !== nextProps.show;
    }

    render() {
        const title = this.props.title ? this.props.title : 'Advertencia';
        return ( 
            <Modal show={this.props.show} onHide={() => {this.props.hideAlert()}}>
            <Modal.Header closeButton> 
                <Modal.Title>{title}</Modal.Title>
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
