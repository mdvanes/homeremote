import React from 'react';
import $http from '../request';
import logger from '../logger';

class Log extends React.Component {
    constructor(props) {
        super(props);
        this.getInfo = this.getInfo.bind(this);
    }

    clear() {
        logger.clear();
    }

    getInfo() {
        $http(this.props.infoUrl)
            .then(data => {
                logger.log(data.status);
            })
            .catch(error => logger.error('error on get info: ' + error));
    }

    render() {
        return (
            <div className="row">
                <div className="col-xs-8 col-md-10">
                    <textarea className="form-control well log"></textarea>
                </div>
                <div className="col-xs-4 col-md-2">
                    <button className="btn btn-default btn-block" onClick={this.clear}>clear</button>
                    <button className="btn btn-default btn-block" onClick={this.getInfo}>get info</button>
                </div>
            </div>
        );
    }
}
export default Log;