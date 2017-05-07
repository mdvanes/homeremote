import React, { PropTypes } from 'react';
import classNames from 'classnames';
import FontIcon from 'material-ui/FontIcon';
import './toggle.scss';

class Toggle extends React.Component {

    constructor(props) {
        super(props);
        this.state = {isChecked: false};
        if(!this.props.id) {
            throw new Error('property ID is required on Toggle');
        }

        fetch('/' + this.props.id + '/status', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(data => data.json())
            .then(data => {
                if(data.status === 'started') {
                    this.setState({isChecked: true});
                }
            })
            .catch(error => this.props.logError('error on toggle: ' + error));

        this.onChange = this.onChange.bind(this);
        this.sendToggle = this.sendToggle.bind(this);
    }

    onChange() {
        console.log('onchange', this, this.state);
        this.setState({isChecked: !this.state.isChecked});
    }

    sendToggle() {
        let url = '/' + this.props.id + '/';
        if(this.state.isChecked) {
            url += 'stop';
        } else {
            url += 'start';
        }
        fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(data => data.json())
            .then(data => {
                if(data.status === 'started') {
                    this.setState({isChecked: true});
                } else if(data.status === 'stopped') {
                    this.setState({isChecked: false});
                }
            })
            .catch(error => this.props.logError('error on toggle: ' + error));
    }

    render() {
        let btnClass = classNames({
            'btn-toggle toggle-button': true,
            'btn-success': this.state.isChecked,
            'btn-danger': !this.state.isChecked
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
    logError: PropTypes.func.isRequired,
    logInfo: PropTypes.func.isRequired
};

export default Toggle;
