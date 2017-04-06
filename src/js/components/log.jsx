import React from 'react';
import logger from '../logger';
import {Card, CardText, CardActions} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import './log.scss';

class Log extends React.Component {
    constructor(props) {
        super(props);
        this.getInfo = this.getInfo.bind(this);
    }

    clear() {
        logger.clear();
    }

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
            logger.log(data.status);
        })
        .catch(error => logger.error('error on get info: ' + error));
    }

    render() {
        return (
            <Card className="log-card">
                <CardText className="log-card-text">
                    <div className="log"></div>
                </CardText>
                <CardActions className="log-card-actions">
                    <FlatButton onClick={this.clear} label="clear"/>
                    <FlatButton onClick={this.getInfo} label="radio info"/>
                </CardActions>
            </Card>
        );
    }
}
export default Log;