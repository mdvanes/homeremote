import React from 'react';
import classNames from 'classnames';
import $http from '../request';
import logger from '../logger';
import FontIcon from 'material-ui/FontIcon';
import './toggle.scss';

class Toggle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {isChecked: false};
        if(!this.props.id) {
            throw new Error('property ID is required on Toggle');
        }
        // TODO replace by Fetch
        $http('/' + this.props.id + '/status')
            .then(data => {
                if(data.status === 'started') {
                    this.setState({isChecked: true});
                }
            })
            .catch(error => logger.error('error on toggle: ' + error));
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
        $http(url)
            .then(data => {
                if(data.status === 'started') {
                    this.setState({isChecked: true});
                } else if(data.status === 'stopped') {
                    this.setState({isChecked: false});
                }
            })
            .catch(error => logger.error('error on toggle: ' + error));
    }

    render() {
        let btnClass = classNames({
            'btn-toggle': true,
            'btn-success': this.state.isChecked,
            'btn-danger': !this.state.isChecked
        });
        let icon = <FontIcon style={{'font-size': '750%'}} className="material-icons">{this.props.icon}</FontIcon>;
        return (
            <button
              className="toggle-button"
              className={btnClass}
              onTouchTap={this.sendToggle}
            >
            {icon}
            {this.props.label}
            </button>
        );
    }
}
export default Toggle;
