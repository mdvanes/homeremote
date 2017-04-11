import React from 'react';
import Gears from '../components/Gears';
import LogContainer from '../containers/LogContainer';

export default class GearsView extends React.Component {
    render() {
        return (
            <div>
                <Gears/>
                <LogContainer infoUrl="/radio/info"/>
            </div>
        );
    }
}