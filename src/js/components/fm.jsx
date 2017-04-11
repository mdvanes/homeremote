import React from 'react';
import RenameButton from './RenameButton';
import MoveButton from '../containers/MoveButton';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';

class FileManager extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dirIndex: [{name: 'No files yet'}],
            targetLocations: []
        };
        this.listDir = this.listDir.bind(this);
        this.ftpUpload = this.ftpUpload.bind(this);
        this.getFtpStatus = this.getFtpStatus.bind(this);
        this.getTargetLocations = this.getTargetLocations.bind(this);
        this.resetFilePermissions = this.resetFilePermissions.bind(this);
        this.listDir('');
        this.getTargetLocations();
    }

    // TODO all fetch calls should be done through a (combined) service. See https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md#style-y035 and http://stackoverflow.com/questions/35855781/having-services-in-react-application
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
        .catch(error => this.props.logError('error on fm/list/path: ' + error));
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
        .catch(error => this.props.logError('error on fm/ftp: ' + error));
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
            this.props.logInfo(`FTP status: ${data.ftpStatus}`);
        })
        .catch(error => this.props.logError('error on fm/ftpstatus: ' + error));
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
        .catch(error => this.props.logError('error on fm/getTargetLocations: ' + error));
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
                this.props.logInfo(`Reset file permissions: ${data.status}`);
            })
            .catch(error => this.props.logError('error on fm/resetFilePermissions: ' + error));
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
                return <TableRow key={entry.name}>
                    <TableRowColumn><FontIcon className="material-icons">folder_open</FontIcon></TableRowColumn>
                    <TableRowColumn onClick={() => {this.listDir(entry.name)}}>{entry.name}</TableRowColumn>
                    <TableRowColumn></TableRowColumn>
                    <TableRowColumn></TableRowColumn>
                    <TableRowColumn></TableRowColumn>
                </TableRow>;
            } else {
                const filePath = this.state.dirName;
                return <TableRow key={entry.name}>
                    <TableRowColumn>{entry.size}</TableRowColumn>
                    <TableRowColumn>{entry.name}</TableRowColumn>
                    <TableRowColumn>
                        <button className="btn btn-default" onClick={() => {this.ftpUpload(filePath)}}>upload</button>
                    </TableRowColumn>
                    <TableRowColumn>
                        <RenameButton path={this.state.dirName} src={entry.name} suggestion={this.state.dirName}/>
                    </TableRowColumn>
                    <TableRowColumn>
                        <MoveButton filePath={filePath} fileName={entry.name} targetLocations={this.state.targetLocations} />
                    </TableRowColumn>
                </TableRow>;
            }
        });
        return (
            <div>
                <h1>File Manager $[rootDir]/{this.state.dirName}</h1>
                <Table className="table table-striped table-hover">
                    <TableHeader>
                        <TableRow>
                            <TableHeaderColumn></TableHeaderColumn>
                            <TableHeaderColumn>Name</TableHeaderColumn>
                            <TableHeaderColumn>FTP</TableHeaderColumn>
                            <TableHeaderColumn>Rename</TableHeaderColumn>
                            <TableHeaderColumn>Move</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableRowColumn></TableRowColumn>
                            <TableRowColumn onClick={() => this.listDir('')}>/</TableRowColumn>
                            <TableRowColumn></TableRowColumn>
                            <TableRowColumn></TableRowColumn>
                            <TableRowColumn></TableRowColumn>
                        </TableRow>
                        {rows}
                    </TableBody>
                </Table>
                <div className="row">
                    <div className="col-xs-6">
                        nr of entries: {rows.length}
                    </div>
                    <div className="col-xs-6">
                        <FlatButton onClick={this.getFtpStatus} className="btn btn-default">Get FTP status</FlatButton>
                        <FlatButton onClick={this.resetFilePermissions} className="btn btn-default">Fix Permissions</FlatButton>
                    </div>
                </div>
            </div>
        );
    }
}
export default FileManager;