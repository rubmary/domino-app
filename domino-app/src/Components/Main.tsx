import React from 'react';
import Board from './Board'
import OptionsWindow from './OptionsWindow';

type State = {
	board: boolean,
	player1: string,
	player2: string
};

class Main extends React.Component<{}, State> {
	constructor(props : {}) {
		super(props);
		this.state = {
			board: false,
			player1: '',
			player2: '',
		};
	}

	showBoard = (player1: string, player2: string) => {
		this.setState({
			board: true,
			player1: player1,
			player2: player2,
		});
	}

	render() {
		const component = this.state.board ?
			<Board
				player1={this.state.player1}
				player2={this.state.player2}
			/> :
			<OptionsWindow showBoard={this.showBoard}/>;
		return component;
	}
}

export default Main;
