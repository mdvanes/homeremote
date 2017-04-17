import React from 'react';
import logger from '../logger';
import FlatButton from 'material-ui/FlatButton';

export default class RenameButton extends React.Component {
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
        var target = prompt(`Rename file ${this.props.src} to`, suggestion);
        if(target) {
            // https://davidwalsh.name/fetch
            fetch('/fm/rename', {
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
                    logger.log('Succesfully renamed');
                }
            })
            .catch(error => logger.error('error on fm/rename: ' + error));
        }
    }

    render() {
        return <FlatButton onTouchTap={this.rename} label="rename"/>
    }
}