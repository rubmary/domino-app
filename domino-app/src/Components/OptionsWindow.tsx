import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

type State = {
	show: boolean
};

type Props = {
	showBoard: () => void
};

class OptionsWindow extends React.Component<Props, State> {
	constructor(props : Props) {
		super(props);
		this.state = {
			show : true
		};
	}

	// const [show, setShow] = useState(false);
	handleClose = () => {
		this.setState({show: false});
		this.props.showBoard();
	}

	handleShow = () => {
		this.setState({show: true});
	}

	render () {
		console.log("INSIDE MODAL");
		return (
			<Modal show={this.state.show}>
				<Modal.Header closeButton>
					<Modal.Title>Modal heading</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					Woohoo, you are reading this text in a modal!
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={this.handleClose}>
						Close
					</Button>
					<Button variant="primary" onClick={this.handleClose}>
						Save Changes
					</Button>
				</Modal.Footer>
			</Modal>
		);
	}
}

export default OptionsWindow;
