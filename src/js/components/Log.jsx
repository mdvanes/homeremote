import React, { PropTypes } from 'react';
import {Card, CardText, CardActions} from 'material-ui/Card';
import ClearLogButton from '../containers/ClearLogButton';
import RadioInfoButton from '../containers/RadioInfoButton';

import './log.scss';

// TODO Log from outside this scope, e.g. from button-group.jsx
// Should make containers/button-group-container.jsx and dispatch logInfo there

class Log extends React.Component {
    constructor(props) {
        super(props);
        this.getShellStatus = this.getShellStatus.bind(this);
        this.getShellStatus();
    }

    // TODO extract to separate file?
    getShellStatus() {
        fetch('/shell/status', {
            credentials: 'same-origin',
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(data => data.json())
        .then(data => {
            if(data.status === 'ok') {
                const resultString = data.entries.map(entry => {
                    return `${entry.name} ${entry.result}`;
                }).join(' / ');
                this.props.logInfo(`getShellStatus: ${resultString}`);
            } else {
                throw new Error('getShellStatus failed');
            }
        })
        .catch(error => this.props.logError('error on getShellStatus: ' + error));
    }

    render() {
        return (
            <Card className="log-card">
                <CardText className="log-card-text">
                    {this.props.loglines.map((logline, index) =>
                        <div key={index}>
                            {logline.message}
                        </div>
                    )}
                </CardText>
                <div className="log"></div>
                <CardActions className="log-card-actions">
                    <ClearLogButton/>
                    <RadioInfoButton/>
                </CardActions>
            </Card>
        );
    }
}

Log.propTypes = {
    loglines: PropTypes.arrayOf(PropTypes.shape({
        message: PropTypes.string.isRequired
    }).isRequired).isRequired
};

export default Log;