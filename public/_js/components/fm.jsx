import React from 'react';
import $http from '../request';
import logger from '../logger';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import RenameButton from './RenameButton';

class FileManager extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dirIndex: [{name: 'No files yet'}],
            targetLocations: []
        };
        this.listDir = this.listDir.bind(this);
        this.ftpUpload = this.ftpUpload.bind(this);
        this.getTargetLocations = this.getTargetLocations.bind(this);
        this.mvToTargetLocation = this.mvToTargetLocation.bind(this);
        this.listDir('');
        this.getTargetLocations();
    }

    // TODO list filesize
    listDir(dirName) {

        fetch('/fm/list/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                path: dirName
            })
        })
        .then(data => {
            return data.json();
        })
        .then(data => {
            this.setState({
                dirIndex: data.list,
                dirName: data.dir
            });
        })
        .catch(error => logger.error('error on fm/list/path: ' + error));
    }

    ftpUpload(filePath) {
        console.log('ftp upload', filePath); // TODO remove
        // TODO instead of this ugly double encoding, use POST vars
        $http('/fm/ftp/' + encodeURIComponent(encodeURIComponent(filePath)))
            .then(data => {
                console.log(data);
                //this.setState({dirIndex: data.list});
            })
            .catch(error => logger.error('error on fm/ftp: ' + error));
    }

    getFtpStatus() {
        $http('/fm/ftpstatus')
            .then(data => {
                logger.log(`FTP status: ${data.ftpStatus}`);
            })
            .catch(error => logger.error('error on fm/ftpstatus: ' + error));
    }

    getTargetLocations() {
        $http('/fm/getTargetLocations')
            .then(data => {
                this.setState({
                    targetLocations: data.targetLocations
                });
            })
            .catch(error => logger.error('error on fm/ftpstatus: ' + error));
    }

    // TODO make more secure by supplying only the ID of the targetLocation and not allow freeform paths
    mvToTargetLocation(filePath, targetLocation) {
        const confirmResult = confirm(`Confirm moving ${filePath} to ${targetLocation}`);
        if(confirmResult) {
            console.log('start moving');
            // TODO
            // My $http can't send POST params
            // instead use https://github.com/request/request-promise-native
            // see POST example on https://www.npmjs.com/package/request-promise
            //$http('/fm/mvToTargetLocation')
            //    .then(data => {
            //        logger.log(`FTP status: ${data.ftpStatus}`);
            //    })
            //    .catch(error => logger.error('error on fm/ftpstatus: ' + error));
        }
    }

    render() {
        // TODO (in many places) better way to supply params to onClick
        // TODO then also move targetLocations outside of "rows"
        //const targetLocations = this.state.targetLocations.map(entry => {
        //    return <MenuItem onClick={() => {this.mvToTargetLocation(filePath, entry)}}>{entry}</MenuItem>
        //});
        const rows = this.state.dirIndex.map(entry => {
            if( entry.isDir ) {
                return <tr>
                    <td><i className="glyphicon glyphicon-folder-open"></i></td>
                    <td onClick={() => {this.listDir(entry.name)}}>{entry.name}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>;
            } else {
                let filePath = entry.name;
                if(this.state.dirName) {
                    filePath = this.state.dirName + '/' + filePath;
                }
                const targetLocations = this.state.targetLocations.map(entry => {
                    return <MenuItem onClick={() => {this.mvToTargetLocation(filePath, entry)}}>{entry}</MenuItem>
                });
                return <tr>
                    <td></td>
                    <td>{entry.name}</td>
                    <td>
                        <button className="btn btn-default" onClick={() => {this.ftpUpload(filePath)}}>upload</button>
                    </td>
                    <td>
                        <RenameButton path={this.state.dirName} src={entry.name} suggestion={this.state.dirName}/>
                    </td>
                    <td>
                        <DropdownButton title="Move">
                            {targetLocations}
                        </DropdownButton>
                    </td>
                </tr>;
            }
        });
        return (
            <div>
                <table className="table table-striped table-hover">
                    <caption>File Manager $[rootDir]/{this.state.dirName}</caption>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Name</th>
                            <th>FTP</th>
                            <th>Rename</th>
                            <th>Move</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td></td>
                            <td onClick={() => this.listDir('')}>/</td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        {rows}
                    </tbody>
                </table>
                <div className="row">
                    <div className="col-xs-6">
                        nr of entries: {rows.length}
                    </div>
                    <div className="col-xs-6">
                        <button onClick={this.getFtpStatus} className="btn btn-default btn-block">Get FTP status</button>
                    </div>
                </div>
            </div>
        );
    }
}
export default FileManager;