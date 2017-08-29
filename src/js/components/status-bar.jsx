import React from 'react';
import classNames from 'classnames';

/**
 * Used to check online/offline status for AppCache
 */
class StatusBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {isOnline: false};

        fetch('/index.html', {
            credentials: 'same-origin',
            method: 'GET',
            headers: {
                'Accept': 'text/html',
                'Content-Type': 'text/html'
            }
        })
        .then(() =>  this.setState({isOnline: true}))
        .catch(() => this.setState({isOnline: false}));
    }

    render() {
        let statusClass = classNames({
            'container-fluid status-bar': true,
            'online': this.state.isOnline,
            'offline bg-danger': !this.state.isOnline
        });
        return (
            <div className={statusClass}>
                <i className="glyphicon glyphicon-remove"></i> Offline mode
            </div>
        );
    }
}
export default StatusBar;
