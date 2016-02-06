import React from 'react';
import logger from '../logger';

class Log extends React.Component {
    constructor(props) {
        super(props);
        this.nyi = this.nyi.bind(this);
    }

    nyi() {
        logger.error('this button is not yet implemented');
    }

    getInfo() {
        logger.log('test log statement');
    }

    render() {
        return (
            <div className="row">
                <div className="col-xs-8 col-md-10">
                    <textarea className="form-control well log"></textarea>
                </div>
                <div className="col-xs-4 col-md-2">
                    <button className="btn btn-default btn-block" onClick={this.nyi}>clear</button>
                    <button className="btn btn-default btn-block" onClick={this.getInfo}>get info</button>
                </div>
            </div>
        );
    }
}
export default Log;