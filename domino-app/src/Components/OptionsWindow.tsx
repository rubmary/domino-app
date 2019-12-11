import React from 'react';
import {
	Button,
	Modal,
	Form,
	Row,
	Col,
	OverlayTrigger,
	Tooltip
} from 'react-bootstrap';

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
		if(this.noValid()) {
			return;
		}
		this.setState({show: false});
		this.props.showBoard(this.state.player1, this.state.player2);
	}

	onChange = (player: string, type: string) => {
		const map : {[id: string] : string} = {
			'Computadora': 'pc',
			'Jugador': 'player'
		};
		if(player === '1') {
			this.setState({player1: map[type]});
		} else {
			this.setState({player2: map[type]});
		}
	}

	tooltip = () => {
		if(this.state.player1 === '' || this.state.player2 === '') {
			return (
				<Tooltip id='tooltip1'>
					Selecciona el modo de ambos jugadores
				</Tooltip>
			);
		}
		if(this.state.player1 === 'player' && this.state.player2 === 'player') {
			return (
				<Tooltip id='tooltip2'>
					Al menos uno de los jugadores debe ser la computadora
				</Tooltip>
			);
		}
		return (<Tooltip id='tooltip3'>Click para jugar</Tooltip>);
	}

	noValid = () => {
		return (
			this.state.player1 === '' ||
			this.state.player2 === '' ||
			(this.state.player1 === 'player' && this.state.player2 === 'player')
		);
	}

	render () {
		return (
			<Modal show={this.state.show} onHide={() => {}}>
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
					<OverlayTrigger
						placement="right"
						delay={{ show: 250, hide: 400 }}
						overlay={this.tooltip()}
						trigger={['click', 'hover', 'focus']}
					>
						<Button
							variant="primary"
							onClick={this.handleClose}
						> OK
						</Button>
					</OverlayTrigger>
				</Modal.Footer>
			</Modal>
		);
	}
}

export default OptionsWindow;
