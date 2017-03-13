import React from 'react';
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
            icon = <i className={'glyphicon glyphicon-' + this.props.icon}></i>;
        }
        return (
            <div className="btn-group btn-group-justified margin-top">
                <a href="#" className="btn btn-default" onClick={this.sendOn}>
                    <i className="glyphicon glyphicon-plus-sign"></i>
                </a>{/* for this.onChange, the bind is done in the constructor */}
                <span className="btn" disabled>
                    {icon}
                    {this.props.label}
                </span>
                <a href="#" className="btn btn-default" onClick={this.sendOff}>
                    <i className="glyphicon glyphicon-minus-sign"></i>
                </a>
            </div>
        );
    }
}
export default ButtonGroup;