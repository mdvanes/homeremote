import React from 'react';
import GetMusic from '../components/GetMusic';
import LogContainer from '../containers/LogContainer';

export default class MusicView extends React.Component {
    render() {
        return (
            <div className="col-xs-12 col-md-3 margin-top">
                <GetMusic/>
                <LogContainer infoUrl="/radio/info"/>
            </div>
        );
    }
}