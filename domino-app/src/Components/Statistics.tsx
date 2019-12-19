import React from 'react';
import {
    Card,
    Dropdown,
    Table
} from 'react-bootstrap';
import Alert from './Alert';
import {
    Statistic,
    fetchGetStatistics
} from '../utils';

type State = {
    showAlert: boolean,
    player1: Statistic,
    player2: Statistic
};

class Statistics extends React.Component<{}, State>{
    constructor(props : {}) {
        super(props);
        this.state = {
            showAlert: false,
            player1: {
                average: 0,
                sum: 0,
                games: 0
            },
            player2: {
                average: 0,
                sum: 0,
                games: 0
            }
        };
    }
    onClick = () => {
        fetchGetStatistics((player1: Statistic, player2: Statistic) => {
            this.setState({showAlert: true, player1, player2});
        })
    }
    hideAlert = () => {
        this.setState({showAlert: false});
    }
    onClickAlert = () => {
        this.hideAlert();
    }

    card = (player: string, statistic: Statistic) =>{
        return (
            <Card >
                <Card.Header>Jugador {player}</Card.Header>
                <Card.Body>
                    <Table borderless size='sm'>
                        <tbody>
                            <tr>
                                <td> Ganancia Promedio </td>
                                <td>{statistic.average.toFixed(4)}</td>
                            </tr>
                            <tr>
                                <td> Suma Total </td>
                                <td>{statistic.sum}</td>
                            </tr>
                            <tr>
                                <td> Número de Juegos </td>
                                <td>{statistic.games}</td>
                            </tr>
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        );
    }

    body = (player1: Statistic, player2: Statistic) => {
        return (
            <>
                {this.card('1', player1)}
                <br />
                {this.card('2', player2)}
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
                >{this.body(this.state.player1, this.state.player2)}
                </Alert>
                <Dropdown.Item onClick={() => {this.onClick()}}>
                    Estadísticas
                </Dropdown.Item>
            </>
        );
    }
};

export default Statistics;
