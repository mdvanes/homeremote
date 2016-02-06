import React from 'react';
import classNames from 'classnames';
import $http from '../request';
import logger from '../logger';

class Toggle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {isChecked: false};
        if(!this.props.id) {
            throw new Error('property ID is required on Toggle');
        }
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
            'btn btn-lg btn-block': true,
            'btn-success': this.state.isChecked,
            'btn-danger': !this.state.isChecked,
            'btn-icon': this.props.icon
        });
        let icon = <i></i>;
        if(this.props.icon) {
            icon = <i className={'glyphicon glyphicon-' + this.props.icon}></i>;
        }
        return (
            <button className={btnClass} onClick={this.sendToggle}>
                {icon}
                {this.props.label}
            </button>
        );
    }
}
export default Toggle;
