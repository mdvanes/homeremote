import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import { connect } from 'react-redux';
import { logInfo, logError } from '../actions';

class RenameButton extends React.Component {
    constructor(props) {
        super(props);
        this.rename = this.rename.bind(this);
    }

    rename() {
        let suggestion = '';
        if(this.props.suggestion) {
            const extension = this.props.src.split('.').pop();
            suggestion = this.props.suggestion + '.' + extension;
        }
        const target = prompt(`Rename file ${this.props.src} to`, suggestion);
        if(target) {
            // https://davidwalsh.name/fetch
            fetch('/fm/rename', {
                credentials: 'same-origin',
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    src: this.props.src,
                    path: this.props.path,
                    target
                })
            })
            .then(response => {
                if(response.status !== 205) {
                    throw new Error('status=' + response.status);
                } else {
                    // TODO should just return statusCode 205 and reset content
                    this.props.logInfo('Successfully renamed');
                }
            })
            .catch(error => this.props.logError('error on fm/rename: ' + error));
        }
    }

    render() {
        return <FlatButton onTouchTap={this.rename} label="rename"/>
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

export default connect(mapStateToProps, mapDispatchToProps)(RenameButton);