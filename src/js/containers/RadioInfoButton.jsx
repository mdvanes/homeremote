import React from 'react';
import { connect } from 'react-redux';
import { logInfo, logError } from '../actions';
import FlatButton from 'material-ui/FlatButton';

class RadioInfoButton extends React.Component {
    constructor(props) {
        super(props);
        this.getInfo = this.getInfo.bind(this);
    }

    getInfo() {
        fetch('/nowplaying/info', {
            credentials: 'same-origin',
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(data => data.json())
        .then(data => {
            const message = data.status;
            this.props.logInfo('Now playing: ' + message);
        })
        .catch(error => this.props.logError('error on get info: ' + error));
    }

    render() {
        return (
            <FlatButton label="Radio Info" onTouchTap={this.getInfo}/>
        );
    }
}

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

export default connect(mapStateToProps, mapDispatchToProps)(RadioInfoButton);