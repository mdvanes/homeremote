import React from 'react';
import {Card, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import logger from '../logger';

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
            icon = <FontIcon className="material-icons">{this.props.icon}</FontIcon>;
        }
        return (
            <Card>
                <CardText>
                    <FlatButton
                      backgroundColor="#a4c639"
                      hoverColor="#8AA62F"
                      onTouchTap={this.sendOn}
                      icon={<FontIcon className="material-icons">radio_button_checked</FontIcon>}
                    />
                    <span className="btn" disabled>
                        {icon}
                        {this.props.label}
                    </span>
                    <FlatButton
                      backgroundColor="#a4c639"
                      hoverColor="#8AA62F"
                      onTouchTap={this.sendOff}
                      icon={<FontIcon className="material-icons">radio_button_unchecked</FontIcon>}
                    />
                </CardText>
            </Card>
        );
    }
}
export default ButtonGroup;