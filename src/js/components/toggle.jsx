import React from 'react';
import $http from '../request';
import logger from '../logger';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';

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
        let bgColor = this.state.isChecked ? 'green' : 'red';
        let icon = <i></i>;
        if(this.props.icon) {
            icon = <FontIcon className="material-icons">{this.props.icon}</FontIcon>;
        }
        return (
            <FlatButton
              backgroundColor={bgColor}
              hoverColor="#8AA62F"
              onTouchTap={this.sendToggle}
              fullWidth={true}
              icon={icon}
            >
            {this.props.label}
            </FlatButton>
        );
    }
}
export default Toggle;
