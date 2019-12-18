import React from 'react';
import { Button } from 'react-bootstrap';
import NewGameAlert from './NewGameAlert';

type State = {
    showAlert: boolean
};

class NewGameButton extends React.Component<{}, State>{
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
            <div className='newGameButton'> 
                <Button
                    onClick={() => {this.onClick()}}
                    variant='secondary'
                    size='lg'
                >
                Nuevo Juego
                </Button>
            </div>
            </>
        );
    }
};

export default NewGameButton;