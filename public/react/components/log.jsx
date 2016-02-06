import React from 'react';

class Log extends React.Component {
    constructor(props) {
        super(props);
        this.nyi = this.nyi.bind(this);
    }

    nyi() {
        alert('this button is not yet implemented');
    }

    render() {
        return (
            <div className="row">
                <div className="col-xs-8 col-md-10">
                    <textarea className="form-control well log"></textarea>
                </div>
                <div className="col-xs-4 col-md-2">
                    <button className="btn btn-default btn-block" onClick={this.nyi}>clear</button>
                    <button className="btn btn-default btn-block" onClick={this.nyi}>get info</button>
                </div>
            </div>
        );
    }
}
export default Log;