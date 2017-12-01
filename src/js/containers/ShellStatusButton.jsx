import React from 'react';
import { connect } from 'react-redux';
import { logInfo, logError } from '../actions';
import FlatButton from 'material-ui/FlatButton';

class ShellStatusButton extends React.Component {
    constructor(props) {
        super(props);
        this.getShellStatus = this.getShellStatus.bind(this);
        this.getShellStatus();
    }

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
        const foo = 'bar';
        return (
            <FlatButton label={foo} onTouchTap={this.getShellStatus}/>
        );
    }
}

const mapStateToProps = () => {
    return {};
};

const mapDispatchToProps = dispatch => {
    return {
        logInfo: (...messages) => {
            dispatch(logInfo(...messages));
        },
        logError: (...messages) => {
            dispatch(logError(...messages));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ShellStatusButton);