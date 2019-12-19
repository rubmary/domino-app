import React from 'react';
import NewGameItem from './NewGameItem';
import Statistics from './Statistics';
import Instructions from './Instructions';
import {
    DropdownButton
} from 'react-bootstrap';

class OptionsDropdown extends React.Component {
    render() {
        return (
            <div className='optionsDropdown' >
                <DropdownButton
                    size='lg'
                    id="dropdown"
                    title='Opciones'
                    drop='up'
                    variant="secondary"
                >
                    <NewGameItem />
                    <Statistics />
                    <Instructions />
                </DropdownButton>
            </div>
        );
    }
}

export default OptionsDropdown;
