import React from 'react';
import LogContainer from '../containers/LogContainer';

export default class LogView extends React.Component {
    render() {
        return (
            <div className="col-xs-12 col-md-3 margin-top">
                <LogContainer />
            </div>
        );
    }
}