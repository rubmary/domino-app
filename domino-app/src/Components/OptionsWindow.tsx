import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

type State = {
	show: boolean,
	player1: string,
	player2: string
};

type Props = {
	showBoard: (player1: string, player2: string) => void
};

class OptionsWindow extends React.Component<Props, State> {
	constructor(props : Props) {
		super(props);
		this.state = {
			show : true,
			player1 : '',
			player2 : ''
		};
	}

	// const [show, setShow] = useState(false);
	handleClose = () => {
		const map : {[id: string] : string} = {
			'Computadora': 'pc',
			'Jugador': 'player'
		};
		const player1 = map[this.state.player1];
		const player2 = map[this.state.player2];
		if (player1 === 'player' && player2 === 'player') {
			return;
		}
		this.setState({show: false});
		this.props.showBoard(map[this.state.player1], map[this.state.player2]);
	}

	onChange = (player: string, type: string) => {
		if(player === '1') {
			this.setState({player1: type});
		} else {
			this.setState({player2: type});
		}
	}

	render () {

		return (
			<Modal show={this.state.show}>
				<Modal.Header>
					<Modal.Title>Configuración</Modal.Title>
				</Modal.Header>
				<Modal.Body> {
					['1', '2'].map( player => (
					<Form.Group as={Row} key={player}>
						<Form.Label column sm={3}>
							Jugador {player}
						</Form.Label>
						<Col sm={15}>
							{['Computadora', 'Jugador'].map(type => (
								<Form.Check
									onChange={() => this.onChange(player, type)}
									type="radio"
									label={type}
									name={player}
									key={type}
									id={type+player}
								/>
							))}
						</Col>
					</Form.Group>
				))} </Modal.Body>
				<Modal.Footer>
					<Button variant="primary" onClick={this.handleClose}>
						OK
					</Button>
				</Modal.Footer>
			</Modal>
		);
	}
}

export default OptionsWindow;
