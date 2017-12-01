import React from 'react';
import { connect } from 'react-redux';
import { logInfo, logError } from '../actions';

class ShellStatusButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            label: 'not loaded'
        };
        this.setLabel = this.setLabel.bind(this);
        this.logStatus = this.logStatus.bind(this);
        this.getShellStatus = this.getShellStatus.bind(this);
        this.setLabel();
    }

    setLabel() {
        this.getShellStatus(data => {
            if(data.status === 'ok' && data.entries.length === 2) {
                this.setState({
                    label: data.entries[1].result
                });
            } else {
                this.setState({
                    label: 'err'
                });
                throw new Error('getShellStatus failed');
            }
        });
    }

    logStatus() {
        this.getShellStatus(data => {
            if(data.status === 'ok') {
                const resultString = data.entries.map(entry => {
                    return `${entry.name} ${entry.result}`;
                }).join(' / ');
                this.props.logInfo(`getShellStatus: ${resultString}`);
            } else {
                throw new Error('getShellStatus failed');
            }
        });
    }

    getShellStatus(fn) {
        fetch('/shell/status', {
            credentials: 'same-origin',
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(data => data.json())
        .then(fn)
        .catch(error => this.props.logError('error on getShellStatus: ' + error));
    }

    render() {
        return (
            <div
                style={{
                    background: 'rgba(0,0,0,0.3)',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '10px',
                    padding: '0.5em 1em',
                    width: '60px',
                    wordBreak: 'break-all'
                }}
                onTouchTap={this.logStatus}>
                {this.state.label}
            </div>
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