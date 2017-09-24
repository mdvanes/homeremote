import React, { PropTypes } from 'react';
import classNames from 'classnames';
import FontIcon from 'material-ui/FontIcon';
import './toggle.scss';

const STATES = Object.freeze({
    ON: Symbol('on'),
    OFF: Symbol('off'),
    ERROR: Symbol('error')
});

class Toggle extends React.Component {

    constructor(props) {
        super(props);
        this.state = {status: STATES.OFF};
        this.sendToggle = this.sendToggle.bind(this);
        this.getService = this.getService.bind(this);
        this.getService(`/${this.props.id}/status`);
    }

    getService(url) {
        fetch(url, {
            credentials: 'same-origin',
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(data => data.json())
            .then(data => {
                if(data.status === 'started') {
                    this.setState({status: STATES.ON});
                } else if(data.status === 'stopped') {
                    this.setState({status: STATES.OFF});
                } else {
                    this.setState({status: STATES.ERROR});
                }
            })
            .catch(error => {
                this.props.logError('error on toggle: ' + error);
                this.setState({status: STATES.ERROR});
            });
    }

    sendToggle() {
        let url = `/${this.props.id}/`;
        if(this.state.status === STATES.ON) {
            url += 'stop';
        } else {
            url += 'start';
        }
        this.getService(url);
    }

    render() {
        let btnClass = classNames({
            'btn-toggle toggle-button': true,
            'btn-success': this.state.status === STATES.ON,
            'btn-danger': this.state.status === STATES.OFF
        });
        let icon = <FontIcon style={{fontSize: '750%'}} className="material-icons">{this.props.icon}</FontIcon>;
        return (
            <button
                className={btnClass}
                onTouchTap={this.sendToggle}
            >
            {icon}
            {this.props.label}
            </button>
        );
    }
}

Toggle.propTypes = {
    id: PropTypes.string.isRequired,
    logError: PropTypes.func.isRequired,
    logInfo: PropTypes.func.isRequired
};

export default Toggle;
