import React from 'react';
import logger from '../logger';

export default class RenameButton extends React.Component {
    constructor(props) {
        super(props);
        this.rename = this.rename.bind(this);
    }

    rename() {
        let suggestion = '';
        if(this.props.suggestion) {
            const extension = this.props.path.split('.').pop();
            suggestion = this.props.suggestion + '.' + extension;
        }
        var result = prompt(`Rename file ${this.props.path} to`, suggestion);
        if(result) {
            // https://davidwalsh.name/fetch
            fetch('/fm/rename/', {
                method: 'POST',
                body: JSON.stringify({
                    result,
                    path: this.props.path
                })
            })
            .then(response => {
                if(response.status === 404) {
                    throw new Error('status=404');
                } else {
                    // TODO should just return statusCode 205 and reset content
                    logger.log('Succesfully renamed');
                }
            })
            .catch(error => logger.error('error on fm/rename: ' + error));
        }
    }

    render() {
        return <button className="btn btn-default" onClick={this.rename}>rename</button>
    }
}