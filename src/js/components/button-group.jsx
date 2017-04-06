import React from 'react';
import {Card, CardText} from 'material-ui/Card';
import FontIcon from 'material-ui/FontIcon';
import logger from '../logger';
import './button-group.scss';
import {deepPurple500} from 'material-ui/styles/colors';

class ButtonGroup extends React.Component {
    constructor(props) {
        super(props);
        if(!this.props.id) {
            throw new Error('property ID is required on Toggle');
        }
        this.sendOn = this.sendOn.bind(this);
        this.sendOff = this.sendOff.bind(this);
        this.sendState = this.sendState.bind(this);
    }

    sendState(state) {
        fetch(`/switch/${this.props.id}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                state,
                type: this.props.type
            })
        })
        .then(data => {
            return data.json();
        })
        .then(data => {
            if(data.status !== 'received') {
                logger.error(`error on send-${state}: ${data.status}`);
            } else {
                logger.log('ok');
            }
        })
        .catch(error => logger.error(`error on send-${state}: ${error}`));
    }

    sendOn() {
        this.sendState('on');
    }

    sendOff() {
        this.sendState('off');
    }

    render() {
        let icon = <i></i>;
        if(this.props.icon) {
            icon = <FontIcon style={{fontSize: '250%'}} className="material-icons">{this.props.icon}</FontIcon>;
        }
        return (
            <Card>
                <CardText className="button-group">
                    <button onTouchTap={this.sendOn}>
                        <FontIcon hoverColor={deepPurple500} className="material-icons">radio_button_checked</FontIcon>
                    </button>
                    <span className="label">
                        {icon}
                        {this.props.label}
                    </span>
                    <button onTouchTap={this.sendOff}>
                        <FontIcon hoverColor={deepPurple500} className="material-icons">radio_button_unchecked</FontIcon>
                    </button>
                </CardText>
            </Card>
        );
    }
}
export default ButtonGroup;