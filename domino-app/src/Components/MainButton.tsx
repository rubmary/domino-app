import React from 'react';
import { Button } from 'react-bootstrap';

class MainButton extends React.Component {
    render() {
        return (
            <div className='mainButton'> 
                <Button
                    onClick={() => {window.location.reload()}}
                    variant='secondary'
                    size='lg'
                >
                Nuevo Juego
                </Button>
            </div>
        );
    }
};

export default MainButton;