import React from 'react';
import { Dropdown } from 'react-bootstrap';
import Alert from './Alert';

type State = {
    showAlert: boolean
};

class Instructions extends React.Component<{}, State>{
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
        this.hideAlert();
    }
    message = () => {
        return 'Instrucciones en construcción';
    }
    render() {
        return (
            <>
                <Alert
                    title={'Instrucciones'}
                    message={this.message()}
                    show={this.state.showAlert}
                    hideAlert={() => {this.hideAlert()}}
                />
                <Dropdown.Item onClick={() => {this.onClick()}}>
                    Instrucciones
                </Dropdown.Item>
            </>
        );
    }
};

export default Instructions;
