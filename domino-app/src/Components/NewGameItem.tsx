import React from 'react';
import { Dropdown } from 'react-bootstrap';
import NewGameAlert from './NewGameAlert';

type State = {
    showAlert: boolean
};

class NewGameItem extends React.Component<{}, State>{
    constructor(props : {}) {
        super(props);
        this.state = {
            showAlert: false
        };
    }
    onClick = () => {
        this.setState({showAlert: true});
    }
    hideAlert = () => {
        this.setState({showAlert: false});
    }
    onClickAlert = () => {
        window.location.reload();
        this.hideAlert();
    }
    render() {
        const message = '¿Estás seguro que deseas reiniciar el juego?';
        return (
            <>
                <NewGameAlert
                    message={message}
                    show={this.state.showAlert}
                    hideAlert={() => {this.hideAlert()}}
                    onClick={() => {this.onClickAlert()}}
                />
                <Dropdown.Item onClick={() => {this.onClick()}}>
                    Nuevo Juego
                </Dropdown.Item>
            </>
        );
    }
};

export default NewGameItem;
