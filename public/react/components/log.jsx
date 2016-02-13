import React from 'react';
import logger from '../logger';

class Log extends React.Component {
    constructor(props) {
        super(props);
        //this.clear = this.clear.bind(this);
        //this.getInfo = this.getInfo.bind(this);
    }

    clear() {
        logger.clear();
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
                    <button className="btn btn-default btn-block" onClick={this.clear}>clear</button>
                    <button className="btn btn-default btn-block" onClick={this.getInfo}>get info</button>
                </div>
            </div>
        );
    }
}
export default Log;