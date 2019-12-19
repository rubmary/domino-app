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
        return (<div>
            Al inicio del juego cada jugador toma una cantidad específica
            de piezas de forma aleatoria y las piezas restantes se dejan
            sin descubrir para ser usadas en turnos posteriores. Al igual
            que en el juego tradicional de dominó, los jugadores juegan
            por turnos alternados (el primero jugador se elige de forma
            arbitraria). Cada uno debe colocar una ficha válidaacorde a
            las reglas estándares del juego.
            <br /> <br />
            Si un jugador no puede colocar una ficha de su mano toma una
            de las que no están descubiertas (si todavía hay disponibles),
            el jugador verifica si puede colocar la ficha tomada y en caso
            contrario pasa el turno y juega el oponente (sólo se puede tomar
            una pieza o pasar si no se puede realizar una jugada con la mano
            actual).
            <br /> <br />
            El juego termina cuando alguno de los jugadores usa todas las
            piezas o cuando ambos jugadores no pueden jugar ni tomar piezas
            nuevas; en este último caso se dice que el juego está bloqueado.
            El ganador es el jugador que se queda sin piezas o, en caso de
            bloqueo, el jugador que acumule menos puntos en todas las piezas
            que quedaron en su mano. La utilidad obtenida es el número de
            puntos que el jugador perdedor acumuló en las piezas que quedaron
            en su mano.
        </div>);
    }
    render() {
        return (
            <>
                <Alert
                    title={'Instrucciones'}
                    show={this.state.showAlert}
                    hideAlert={() => {this.hideAlert()}}
                >
                {this.message()}
                </Alert>
                <Dropdown.Item onClick={() => {this.onClick()}}>
                    Instrucciones
                </Dropdown.Item>
            </>
        );
    }
};

export default Instructions;
