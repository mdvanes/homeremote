import React, { PropTypes } from 'react';
import logger from '../logger';
import {Card, CardText, CardActions} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import Snackbar from 'material-ui/Snackbar';
import ClearLogButton from '../containers/ClearLogButton';

import './log.scss';

class Log extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            snackBarOpen: false,
            snackBarMessage: ''
        };
        this.getInfo = this.getInfo.bind(this);
        this.handleSnackbarClose = this.handleSnackbarClose.bind(this);
    }

    // TODO Extract to container like ClearLogButton
    getInfo() {
        fetch(this.props.infoUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(data => data.json())
        .then(data => {
            const message = data.status;
            logger.log(message);
            this.setState({
                snackBarOpen: true,
                snackBarMessage: message
            });
        })
        .catch(error => logger.error('error on get info: ' + error));
    }

    handleSnackbarClose() {
        // TODO do this through LogContainer.mapDispatchToProps ?
        this.setState({
            snackBarOpen: false,
        });
    }

    render() {
        return (
            <Card className="log-card">
                <CardText className="log-card-text">
                    {this.props.loglines.map(logline =>
                        <div key={logline.message}>
                            {logline.message}
                        </div>
                    )}
                </CardText>
                <div className="log"></div>
                <CardActions className="log-card-actions">
                    {/*<FlatButton onClick={Log.clear} label="clear"/>*/}
                    <ClearLogButton/>
                    <FlatButton onClick={this.getInfo} label="radio info"/>
                </CardActions>
                {/*<Snackbar
                    open={this.state.snackBarOpen}
                    message={this.state.snackBarMessage}
                    autoHideDuration={4000}
                    onRequestClose={this.handleSnackbarClose}
                />*/}
                <Snackbar
                    open={this.props.showShortMessage}
                    message={this.props.shortMessage}
                    autoHideDuration={4000}
                    onRequestClose={this.handleSnackbarClose}
                />
            </Card>
        );
    }
}

Log.propTypes = {
    loglines: PropTypes.arrayOf(PropTypes.shape({
        message: PropTypes.string.isRequired
    }).isRequired).isRequired
}

export default Log;