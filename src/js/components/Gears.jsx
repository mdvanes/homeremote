import React from 'react';
import logger from '../logger';

class GetMusic extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: []
        };
        this.getInfo = this.getInfo.bind(this);
        this.getInfo();
    }

    getInfo() {
        //logger.log('Get Info: ' + this.state.url);
        //event.preventDefault();

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
                logger.log('info ok');
                this.setState({
                    list: data.list
                });
            } else {
                throw new Error('gears info failed');
            }
        })
        .catch(error => logger.error('error on gears/info: ' + error));
    }

    render() {
        const rows = this.state.list.map(entry => {
            return  <tr key={entry.name}>
                <td>{entry.type}</td>
                <td>{entry.name}</td>
                <td>{entry.percentage}%</td>
                <td>{entry.status}</td>
            </tr>;
        });
        return (
            <div className="row">
                <div className="col-lg-6">
                    <table className="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}
export default GetMusic;