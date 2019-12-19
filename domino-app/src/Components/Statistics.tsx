import React from 'react';
import {
    Card,
    Dropdown,
    Table
} from 'react-bootstrap';
import Alert from './Alert';

type State = {
    showAlert: boolean
};

class Statistics extends React.Component<{}, State>{
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

    card = (player: string) =>{
        return (
            <Card >
                <Card.Header>Player {player}</Card.Header>
                <Card.Body>
                    <Table borderless size='sm'>
                        <tbody>
                            <tr>
                                <td> Ganancia Promedio </td>
                                <td> 0 </td>
                            </tr>
                            <tr>
                                <td> Suma Total </td>
                                <td> 0 </td>
                            </tr>
                            <tr>
                                <td> Número de Juegos </td>
                                <td> 0 </td>
                            </tr>
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        );
    }
    message = () => {
        return (
            <>
                {this.card('1')}
                <br />
                {this.card('2')}
            </>
        );
    }
    render() {
        return (
            <>
                <Alert
                    title={'Estadísticas'}
                    show={this.state.showAlert}
                    hideAlert={() => {this.hideAlert()}}
                >{this.message()}
                </Alert>
                <Dropdown.Item onClick={() => {this.onClick()}}>
                    Estadísticas
                </Dropdown.Item>
            </>
        );
    }
};

export default Statistics;
