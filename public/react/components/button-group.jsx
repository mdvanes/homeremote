import React from 'react';
import $http from '../request';

class ButtonGroup extends React.Component {
    constructor(props) {
        super(props);
        if(!this.props.id) {
            throw new Error('property ID is required on Toggle');
        }
        this.sendOn = this.sendOn.bind(this);
        this.sendOff = this.sendOff.bind(this);
    }

    sendOn() {
        $http('/' + this.props.id + '/on')
            .then(data => {
                if(data.status !== 'received') {
                    alert('error with setting');
                }
            })
            .catch(error => alert('error on sendOn' + error));
    }

    sendOff() {
        $http('/' + this.props.id + '/off')
            .then(data => {
                if(data.status !== 'received') {
                    alert('error with setting');
                }
            })
            .catch(error => alert('error on sendOff' + error));
    }

    render() {
        let icon = <i></i>;
        if(this.props.icon) {
            icon = <i className={'glyphicon glyphicon-' + this.props.icon}></i>;
        }
        return (
            <div className="btn-group btn-group-justified">
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