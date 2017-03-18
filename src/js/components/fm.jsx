import React from 'react';
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
        this.resetFilePermissions = this.resetFilePermissions.bind(this);
        this.listDir('');
        this.getTargetLocations();
    }

    listDir(dirName) {
        if(this.state.dirName && this.state.dirName.length > 0 &&
            dirName && dirName.length > 0) {
            dirName = this.state.dirName + '/' + dirName;
        }
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
        .then(data => data.json())
        .then(data => {
            this.setState({
                dirIndex: data.list,
                dirName: data.dir
            });
        })
        .catch(error => logger.error('error on fm/list/path: ' + error));
    }

    ftpUpload(filePath) {
        fetch('/fm/ftp/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                path: filePath
            })
        })
        .then(data => data.json())
        .then(data => {
            console.log(data);
        })
        .catch(error => logger.error('error on fm/ftp: ' + error));
    }

    getFtpStatus() {
        fetch('/fm/ftpstatus', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(data => data.json())
        .then(data => {
            logger.log(`FTP status: ${data.ftpStatus}`);
        })
        .catch(error => logger.error('error on fm/ftpstatus: ' + error));
    }

    getTargetLocations() {
        fetch('/fm/getTargetLocations', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(data => data.json())
        .then(data => {
            this.setState({
                targetLocations: data.targetLocations
            });
        })
        .catch(error => logger.error('error on fm/getTargetLocations: ' + error));
    }

    // TODO make more secure by supplying only the ID of the targetLocation and not allow freeform paths
    mvToTargetLocation(filePath, fileName, targetLocation) {
        const confirmResult = confirm(`Confirm moving ${filePath}/${fileName} to ${targetLocation}`);
        if(confirmResult) {
            fetch('/fm/mvToTargetLocation', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    sourcePath: filePath,
                    fileName: fileName,
                    targetPath: targetLocation
                })
            })
            .then(data => data.json())
            .then(data => {
                if(data.status === 'ok') {
                    logger.log('move completed');
                } else {
                    throw new Error('move failed');
                }
            })
            .catch(error => logger.error('error on fm/mvToTargetLocation: ' + error));
        }
    }

    resetFilePermissions() {
        const confirmResult = confirm('Confirm resetting file permissions to rwrwrw');
        if(confirmResult) {
            fetch('/fm/resetFilePermissions', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then(data => data.json())
            .then(data => {
                logger.log(`Reset file permissions: ${data.status}`);
            })
            .catch(error => logger.error('error on fm/resetFilePermissions: ' + error));
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
                return <tr key={entry.name}>
                    <td><i className="glyphicon glyphicon-folder-open"></i></td>
                    <td onClick={() => {this.listDir(entry.name)}}>{entry.name}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>;
            } else {
                let filePath = this.state.dirName;
                let fileName = entry.name;
                //if(this.state.dirName) {
                //    filePath = this.state.dirName + '/' + filePath;
                //}
                const targetLocations = this.state.targetLocations.map(entry => {
                    return <MenuItem key={entry} onClick={() => {this.mvToTargetLocation(filePath, fileName, entry)}}>{entry}</MenuItem>
                });
                return <tr key={entry.name}>
                    <td>{entry.size}</td>
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
                        <button onClick={this.getFtpStatus} className="btn btn-default">Get FTP status</button>
                        <button onClick={this.resetFilePermissions} className="btn btn-default">Fix Permissions</button>
                    </div>
                </div>
            </div>
        );
    }
}
export default FileManager;