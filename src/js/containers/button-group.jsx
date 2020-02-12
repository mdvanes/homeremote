import React from 'react';
import {Card, CardText} from 'material-ui/Card';
import FontIcon from 'material-ui/FontIcon';
import { connect } from 'react-redux';
import { logInfo, logError } from '../actions';
import './button-group.scss';
import {deepPurple500, deepPurple900} from 'material-ui/styles/colors';

const selectorStates = {
    0: 'disarmed',
    10: 'partarmed',
    20: 'armed'
};

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
            credentials: 'same-origin',
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
                this.props.logError(`error on send-${state}: ${data.status}`);
            } else {
                this.props.logInfo(`Switch ${this.props.id} ${state}`);
                this.props.cb();
            }
        })
        .catch(error => this.props.logError(`error on send-${state}: ${error}`));
    }

    sendOn() {
        this.sendState('on');
    }

    sendOff() {
        this.sendState('off');
    }

    getIconElem() {
        const { icon } = this.props;
        return icon ? <FontIcon style={{fontSize: '250%'}} className="material-icons">{icon}</FontIcon> : <i></i>;
    }

    getLabelStr() {
        const { label, dimLevel, type } = this.props;
        if ( type === 'selector' ) {
            return `${label}: ${selectorStates[dimLevel]}`;
        }
        return dimLevel !== null ? `${label} (${dimLevel}%)` : label;
    }

    getButtonStyle(buttonType) {
        const { status } = this.props;
        return { backgroundColor: status === buttonType ? deepPurple500 : 'transparent' }
    }

    // eslint-disable-next-line complexity
    getIcon(side) {
        const { label } = this.props; // TODO should be by type or something, not by name
        if(side === 'left') {
            return label === 'Blinds' ? 'arrow_drop_down' : 'radio_button_checked';
        }
        return label === 'Blinds' ? 'arrow_drop_up' : 'radio_button_unchecked';
    }

    // eslint-disable-next-line complexity
    render() {
        const { readOnly } = this.props;
        const iconElem = this.getIconElem();
        const labelStr = this.getLabelStr();
        const leftIcon = this.getIcon('left');
        const rightIcon = this.getIcon('right');
        return (
            <Card className="card">
                <CardText className="button-group">
                    <button onTouchTap={readOnly ? null : this.sendOn} style={this.getButtonStyle('On')}>
                        {readOnly ? <div className="dummy"></div> : <FontIcon hoverColor={deepPurple900} className="material-icons">{leftIcon}</FontIcon>}
                    </button>
                    <span className="label">
                        {iconElem}
                        {labelStr}
                    </span>
                    <button onTouchTap={readOnly ? null : this.sendOff} style={this.getButtonStyle('Off')}>
                        {readOnly ? <div className="dummy"></div> : <FontIcon hoverColor={deepPurple900} className="material-icons">{rightIcon}</FontIcon>}
                    </button>
                </CardText>
            </Card>
        );
    }
}

// console.log(ButtonGroup1);

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

export default connect(mapStateToProps, mapDispatchToProps)(ButtonGroup);