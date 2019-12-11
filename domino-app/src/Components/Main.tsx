import React from 'react';
import Board from './Board'
import OptionsWindow from './OptionsWindow';

type State = {
	board: boolean
};

class Main extends React.Component<{}, State> {
	
	constructor(props : {}) {
		super(props);
		this.state = {
			board: false
		};
	}

	showBoard = () => {
		this.setState({board: true});
	}

	render() {
		const component = this.state.board ?
			<Board/> :
			<OptionsWindow showBoard={this.showBoard}/>;
		return (component);
	}
}

export default Main;
