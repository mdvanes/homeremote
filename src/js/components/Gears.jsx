import React, { PropTypes } from 'react';
import './simple-material-table.scss';
import FontIcon from 'material-ui/FontIcon';
import {blue500, green800} from 'material-ui/styles/colors';

class Gears extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: []
        };
        this.getInfo = this.getInfo.bind(this);
        this.getInfo();
    }

    getInfo() {
        fetch('/gears/info', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(data => data.json())
        .then(data => {
            if(data.status === 'ok') {
                this.props.logInfo('Gears: data loaded');
                this.setState({
                    list: data.list
                });
            } else {
                throw new Error('gears info failed');
            }
        })
        .catch(error => this.props.logError('error on gears/info: ' + error));
    }

    render() {
        const getIcon = type => {
            if(type === 'tr') {
                return <FontIcon color={blue500} className="material-icons">directions_car</FontIcon>;
            } else {
                return <FontIcon color={green800} className="material-icons">queue</FontIcon>;
            }
        };
        const rows = this.state.list.map(entry => {
            return  <tr key={entry.name}>
                <td title={entry.type}>{getIcon(entry.type)}</td>
                <td>{entry.name}</td>
                <td>{entry.percentage}%</td>
                <td>{entry.status}</td>
            </tr>;
        });
        return (
            <table className="simple-material-table">
                <thead>
                    <tr>
                        <th>Type</th>
                        <th>Name</th>
                        <th></th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </table>
        );
    }
}

Gears.propTypes = {
    logError: PropTypes.func.isRequired,
    logInfo: PropTypes.func.isRequired
};

export default Gears;