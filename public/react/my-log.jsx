import React from 'react';

class MyLog extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <button className="btn btn-default">clear</button>
                <button className="btn btn-default">get info</button>
                <textarea className="form-control"></textarea>
            </div>
        );
    }
}
export default MyLog;